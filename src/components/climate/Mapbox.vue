<template>
    <div class="map-container">
        <div id="map"></div>
        <template v-if="legendStyle">
            <Legend :style="legendStyle"
                    :hasAltStyle="hasAltStyle"
                    :usingAltStyle="_usingAltRamp"
                    :discrete="discrete"
                    class="legend-overlay"
                    :hoveredValue="legendHoveredValue" 
                    @changeLegend="changeLegend"/>
        </template>
        <template v-else>
            <div v-if="connectionError || loadingData || errorLoadingData" class="missing-message">
                <button v-if="connectionError" @click="reloadClimate">Reload Data</button>
                <span v-if="loadingData">Loading Data...</span>
                <span v-if="errorLoadingData">Missing Dataset</span>
            </div>
        </template>
    </div>
</template>

<script>
    import mapboxgl from "mapbox-gl";
    import "mapbox-gl/dist/mapbox-gl.css";
    import { fromArrayBuffer } from "geotiff";
    import chroma from "chroma-js";
    import Legend from "./Legend.vue";

    export default {
        name: "Mapbox",
        components: { Legend },
        props: {
            token: { type: String, required: true },
            tileset: { type: String, required: true },
            sourceLayer: { type: String, required: true },
            admProperty: { type: String, required: true },
            parameters: { type: Object, default: () => ({}) },
            selectedLocation: { type: Object, default: () => ({}) }
        },
        data() {
            return {
                fetchedData: null,
                map: null,
                currentPopup: null,
                admValue: null,
                suppressEmit: false,
                lastLocation: null,
                lastPopupLngLat: null,
                lastProjectedData: null,
                legendStyle: null,
                hasAltStyle: false,
                discrete: false,

                tifBand: null,
                tifImage: null,
                legendHoveredValue: null,
                provincialValueMap: {},
                unit: null,

                hoverFeature: null,
                selectedFeature: null,

                loadingData: false,
                errorLoadingData: false,
                connectionError: false,
                reloadParams: null,
                emptyPopup: false
            };
        },
        watch: {
            parameters(newVal, oldVal) {
                // 1) Ignore external events (Mapbox clicks) to avoid loops
                if (newVal?.source === "external") return;

                // 2) Extract params and locations safely
                const newParams = { ...newVal };
                const oldParams = { ...oldVal };
                const newLocation = newParams.location || null;
                const oldLocation = oldParams.location || null;
                delete newParams.location;
                delete oldParams.location;

                // 3) If only non-location params changed, render and optionally refresh popup
                const keysToCheck = [
                    "tab",
                    "pastData",
                    "projectedData",
                    "pastPeriod",
                    "projectedPeriod",
                    "scenario"
                ];
                const paramsChanged = keysToCheck.some(
                    key => newParams[key] !== oldParams[key]
                );
                if (paramsChanged) {
                    this.renderClimate(newParams).then(() => {
                        if (this.currentPopup) {
                            const pos = this.currentPopup.getLngLat();
                            const lngLat = [pos.lng, pos.lat];
                            this.fetchPopupData(this.admValue || "", lngLat);
                        }
                        else if (newLocation?.name && newLocation?.lon != null && newLocation?.lat != null) {
                            const lngLat = [parseFloat(newLocation.lon), parseFloat(newLocation.lat)];
                            this.fetchPopupData(newLocation.name, lngLat);
                        }
                    });
                }

                // 4) If the location changed, fly to the new location and fetch data
                const locationChanged = !!newLocation && (!oldLocation || newLocation.name !== oldLocation.name);
                if (locationChanged) {
                    const lngLat = [
                        parseFloat(newLocation.lon),
                        parseFloat(newLocation.lat)
                    ];
                    if (Number.isFinite(lngLat[0]) && Number.isFinite(lngLat[1])) {
                        this.admValue = newLocation.name;
                        this.suppressEmit = true;
                        this.flyToWithOffset(lngLat, Math.max(this.map.getZoom(), 7));
                        this.map.once("moveend", () => {
                            if (!paramsChanged) {
                                this.fetchPopupData(this.admValue, lngLat);
                            }
                            this.suppressEmit = false;
                        });
                    }
                }

                // 5) If nothing changed at all, restore last popup
                if (!paramsChanged && !locationChanged) {
                    this.restoreLastPopup();
                }

                // 6) If tab changed, resize and keep the last popup centered
                if (newParams.tab !== oldParams.tab) {
                    this.$nextTick(() => {
                        this.map.resize();
                    });
                }
            },
            selectedLocation(newVal, oldVal) {
                // Keep panel layout stable when selection appears/disappears
                if ((!oldVal && newVal) || (!newVal && oldVal)) {
                    this.$nextTick(() => {
                        this.map.resize();
                    });
                }
            },
            admValue(newVal) {
                if (this.map) {
                    if (this.map.getLayer("dynamic-layer-highlight")) {
                        this.map.removeLayer("dynamic-layer-highlight");
                    }
                    this.map.addLayer({
                        id: "dynamic-layer-highlight",
                        type: "line",
                        source: "dynamic-source",
                        "source-layer": this.sourceLayer,
                        paint: {
                            "line-color": "#ff0000",
                            "line-width": 2,
                            "line-opacity": 1.0
                        },
                        filter: ["==", ["get", this.admProperty], newVal]
                    }, "dynamic-layer-outline");
                    this.map.moveLayer("dynamic-layer-highlight");
                }
            }
        },
        methods: {
            arraysNumericallySame(band, thresholds) {
                if (!Array.isArray(band) || !Array.isArray(thresholds)) return false;
                return band.every(val => {
                    const numVal = Number(val);
                    return thresholds.some(t => Number(t) === numVal);
                });
            },
            async renderClimate(newParams) {
                const savedParams = newParams;
                try {
                    const toSend = {};
                    if (newParams.tab === "Current") {
                        Object.assign(toSend, {
                            pastData: newParams.pastData,
                            pastPeriod: newParams.pastPeriod
                        });
                    }
                    else if (newParams.tab === "Projected") {
                        Object.assign(toSend, {
                            projectedData: newParams.projectedData,
                            projectedPeriod: newParams.projectedPeriod,
                            scenario: newParams.scenario
                        });
                    }

                    const paramString = new URLSearchParams(
                        Object.entries(toSend).map(([k, v]) => [k, String(v)])
                    ).toString();

                    const endpoint =
                        newParams.tab === "Current"
                            ? "/api/climate/current_tif"
                            : "/api/climate/projectedmapjson";

                    this.loadingData = true;
                    this.errorLoadingData = false;
                    this.connectionError = false;
                    this.legendStyle = null;
                    const res = await fetch(`${endpoint}?${paramString}`);
                    if (!res.ok) {
                        throw new Error(`Bad response: ${res.status}`);
                    }

                    const scaling = res.headers.get("X-Scaling");
                    const rampHeader = res.headers.get("X-Ramp");
                    const ramp = rampHeader ? JSON.parse(rampHeader) : [];
                    const altRampHeader = res.headers.get("X-AltRamp");
                    const altRamp = altRampHeader ? JSON.parse(altRampHeader) : [];
                    const minHeader = res.headers.get("X-Min");
                    const maxHeader = res.headers.get("X-Max");
                    const altMinHeader = res.headers.get("X-AltMin");
                    const altMaxHeader = res.headers.get("X-AltMax");
                    const decimals = res.headers.get("X-Decimals") || 1;
                    const unit = res.headers.get("X-Unit") || "";
                    this.unit = unit;

                    this.projectedMin = minHeader !== null ? parseFloat(minHeader) : Math.min(...band);
                    this.projectedMax = maxHeader !== null ? parseFloat(maxHeader) : Math.max(...band);

                    this.hasAltStyle = altRamp && altMinHeader && altMaxHeader;
                    this.discrete = false;

                    if (newParams.tab === "Current") {
                        const arrayBuffer = await res.arrayBuffer();
                        const tiff = await fromArrayBuffer(arrayBuffer);
                        const image = await tiff.getImage();
                        const rawBand = (await image.readRasters())[0];
                        const band = Array.from(rawBand, v => Number(v.toFixed(decimals)));
                        const { thresholds, enrichedRamp } = this.computeThresholds(
                            band, ramp, scaling, minHeader, maxHeader, decimals
                        );
                        this.legendStyle = { ramp: enrichedRamp, unit };
                        this.tifSource(image, band, ramp, thresholds);
                        this.tifBand = band;
                        this.tifImage = image;
                        this._lastProjected = null;
                    }
                    else {
                        const response = await res.json();
                        const jsonData = response.map(d => [d.province, Number(d.averageAnomaly.toFixed(decimals))]);
                        const band = jsonData.map(d => d[1]);
                        const { thresholds, enrichedRamp } = this.computeThresholds(
                            band, this._usingAltRamp ? altRamp : ramp, scaling, this._usingAltRamp ? altMinHeader : minHeader, this._usingAltRamp ? altMaxHeader : maxHeader, decimals
                        );
                        this.legendStyle = { ramp: enrichedRamp, unit };
                        this.jsonSource(jsonData, this._usingAltRamp ? altRamp : ramp, thresholds);
                        this._lastProjected = { jsonData, band, ramp, altRamp, scaling, minHeader, maxHeader, altMinHeader, altMaxHeader, decimals, unit };

                        if (this._usingAltRamp && this.arraysNumericallySame(band, thresholds)) {
                            this.discrete = true;
                        }
                        else {
                            this.discrete = false;
                        }
                    }
                    this.loadingData = false;
                }
                catch (err) {
                    console.error("Error rendering:", err);
                    if (this.map.getLayer("tif-layer")) this.map.removeLayer("tif-layer");
                    if (this.map.getSource("tif-source")) this.map.removeSource("tif-source");
                    if (this.map.getLayer("newfill")) this.map.removeLayer("newfill");
                    if (this._hoverHandler) {
                        this.map.off("mousemove", this._hoverHandler);
                        this._hoverHandler = null;
                    }
                    const src = this.map.getSource("tif-highlight");
                    if (src) {
                        src.setData({
                            type: "FeatureCollection",
                            features: []
                        });
                    }
                    this.tifBand = null;
                    this.tifImage = null;
                    this.legendStyle = null;
                    this.loadingData = false;

                    if (err.name === "TypeError") {
                        this.connectionError = true;
                        this.errorLoadingData = false;
                        this.reloadParams = savedParams;
                    }
                    else {
                        this.errorLoadingData = true;
                        this.connectionError = false;
                    }  
                }
            },
            changeLegend(usingAlt) {
                if (this._lastProjected && this._usingAltRamp !== usingAlt) {
                    const { jsonData, band, ramp, altRamp, scaling, minHeader, maxHeader, decimals, unit, altMinHeader, altMaxHeader } = this._lastProjected;
                    const activeRamp = this._usingAltRamp ? ramp : altRamp;
                    const activeMinHdr = this._usingAltRamp ? minHeader : altMinHeader;
                    const activeMaxHdr = this._usingAltRamp ? maxHeader : altMaxHeader;
                    const { thresholds, enrichedRamp } = this.computeThresholds(
                        band, activeRamp, scaling, activeMinHdr, activeMaxHdr, decimals
                    );
                    this.legendStyle = { ramp: enrichedRamp, unit };
                    this.jsonSource(jsonData, activeRamp, thresholds);
                    this._usingAltRamp = usingAlt;

                    if (this._usingAltRamp && this.arraysNumericallySame(band, thresholds)) {
                        this.discrete = true;
                    }
                    else {
                        this.discrete = false;
                    }
                }
            },
            async reloadClimate()
            {
                this.renderClimate(this.reloadParams).then(() => {
                    if (this.currentPopup) {
                        this.fetchPopupData(this.lastLocation, this.lastPopupLngLat);
                    }
                })
            },
            computeThresholds(band, ramp, scaling, minHeader, maxHeader, decimals) {
                let min = minHeader !== null && !isNaN(parseFloat(minHeader))
                    ? parseFloat(minHeader)
                    : Infinity;
                let max = maxHeader !== null && !isNaN(parseFloat(maxHeader))
                    ? parseFloat(maxHeader)
                    : -Infinity;

                if (min === Infinity || max === -Infinity) {
                    for (let val of band) {
                        if (typeof val !== "number" || isNaN(val)) continue;
                        if (val < min) min = val;
                        if (val > max) max = val;
                    }
                }

                if (!isFinite(min) || !isFinite(max)) {
                    throw new Error("Invalid min/max");
                }

                const n = ramp.length;
                let thresholds = [];

                if (scaling === "linear") {
                    if (min === max && n === 1) {
                        thresholds = [Number(min.toFixed(decimals))];
                    }
                    else {
                        for (let i = 0; i < n; i++) {
                            const raw = min + (i / (n - 1)) * (max - min);
                            thresholds.push(Number(raw.toFixed(decimals)));
                        }
                    }
                }
                else if (scaling === "fixed") {
                    thresholds = ramp.map(entry => Number(entry.value.toFixed(decimals)));
                }

                const enrichedRamp = ramp.map((entry, i) => ({
                    ...entry,
                    threshold: thresholds[i]
                }));

                return { thresholds, enrichedRamp };
            },
            tifSource(image, band, ramp, thresholds) {
                const width = image.getWidth();
                const height = image.getHeight();
                const [originX, originY] = image.getOrigin();
                const [resX, resY] = image.getResolution();

                const features = [];
                for (let y = 0; y < height; y++) {
                    const top = +(originY + y * resY).toFixed(6);
                    const bottom = +(top + resY).toFixed(6);

                    for (let x = 0; x < width; x++) {
                        const left = +(originX + x * resX).toFixed(6);
                        const right = +(left + resX).toFixed(6);
                        const idx = y * width + x;
                        const val = band[idx];
                        if (typeof val !== "number" || isNaN(val)) continue;

                        const color = this.interpolateColor(val, ramp, thresholds);

                        features.push({
                            type: "Feature",
                            geometry: {
                                type: "Polygon",
                                coordinates: [[[left, top], [right, top], [right, bottom], [left, bottom], [left, top]]]
                            },
                            properties: { value: val, color }
                        });
                    }
                }

                const geojson = { type: "FeatureCollection", features };

                if (this.map.getLayer("newfill")) this.map.removeLayer("newfill");
                if (this.map.getLayer("tif-layer")) this.map.removeLayer("tif-layer");
                if (this.map.getSource("tif-source")) this.map.removeSource("tif-source");

                this.map.addSource("tif-source", { type: "geojson", data: geojson });
                this.map.addLayer({
                    id: "tif-layer",
                    type: "fill",
                    source: "tif-source",
                    paint: { "fill-color": ["get", "color"], "fill-opacity": 0.7, "fill-antialias": false }
                });

                if (this.map.getLayer("dynamic-layer-outline")) {
                    this.map.moveLayer("dynamic-layer-outline");
                }

                if (this.map.getLayer("dynamic-layer-highlight")) {
                    this.map.moveLayer("dynamic-layer-highlight");
                }

                if (this.map.getLayer("tif-highlight-layer")) {
                    this.map.moveLayer("tif-highlight-layer");
                }

                if (this._hoverHandler) {
                    this.map.off("mousemove", this._hoverHandler);
                    this._hoverHandler = null;
                }

                this.legendHoveredValue = null;

                this._hoverHandler = (e) => {
                    if (!this.tifImage) return;
                    const [originX, originY] = this.tifImage.getOrigin();
                    const [resX, resY] = this.tifImage.getResolution();
                    const x = Math.floor((e.lngLat.lng - originX) / resX);
                    const y = Math.floor((e.lngLat.lat - originY) / resY);
                    const width = this.tifImage.getWidth();
                    const height = this.tifImage.getHeight();

                    if (x < 0 || y < 0 || x >= width || y >= height) {
                        this.legendHoveredValue = null;
                        const src = this.map.getSource("tif-highlight");
                        if (src) src.setData({ type: "FeatureCollection", features: [] });
                        return;
                    }

                    this.legendHoveredValue = this.tifBand[y * width + x];

                    const left = +(originX + x * resX).toFixed(6);
                    const right = +(left + resX).toFixed(6);
                    const top = +(originY + y * resY).toFixed(6);
                    const bottom = +(top + resY).toFixed(6);

                    this.hoverFeature = {
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: [[[left, top], [right, top], [right, bottom], [left, bottom], [left, top]]]
                        },
                        properties: {}
                    };

                    const features = [];
                    if (this.hoverFeature) features.push(this.hoverFeature);
                    if (this.selectedFeature && this.currentPopup) features.push(this.selectedFeature);
                    const src = this.map.getSource("tif-highlight");
                    if (src) src.setData({ type: "FeatureCollection", features });
                };

                this.map.on("mousemove", this._hoverHandler);
            },
            jsonSource(data, ramp, thresholds) {
                const matchExpression = ["match", ["get", this.admProperty]];
                this.provincialValueMap = {};

                data.forEach(([province, val]) => {
                    const color = this.interpolateColor(val, ramp, thresholds);
                    matchExpression.push(province, color);
                    this.provincialValueMap[province] = val;
                });
                matchExpression.push("#9d4edd");

                if (this.map.getLayer("tif-layer")) this.map.removeLayer("tif-layer");
                if (this.map.getSource("tif-source")) this.map.removeSource("tif-source");
                if (this.map.getLayer("newfill")) this.map.removeLayer("newfill");

                this.map.addLayer({
                    id: "newfill",
                    type: "fill",
                    source: "dynamic-source",
                    "source-layer": this.sourceLayer,
                    paint: {
                        "fill-color": matchExpression,
                        "fill-opacity": 0.7,
                        "fill-antialias": false
                    }
                });

                if (this._hoverHandler) {
                    this.map.off("mousemove", this._hoverHandler);
                    this._hoverHandler = null;
                }

                this.legendHoveredValue = null;

                this._hoverHandler = (e) => {
                    const features = this.map.queryRenderedFeatures(e.point, { layers: ["newfill"] });
                    if (!features || features.length === 0) {
                        this.legendHoveredValue = null;
                        return;
                    }
                    const props = features[0].properties;
                    const province = props[this.admProperty];
                    this.legendHoveredValue = this.provincialValueMap[province];
                };

                this.map.on("mousemove", this._hoverHandler);

                if (this.map.getLayer("dynamic-layer-highlight")) {
                    this.map.moveLayer("dynamic-layer-highlight");
                }

                this.map.getSource("tif-highlight").setData({ type: "FeatureCollection", features: [] });
            },
            interpolateColor(val, ramp, thresholds) {
                if (val <= thresholds[0]) return ramp[0].color;
                if (val >= thresholds[thresholds.length - 1]) return ramp[ramp.length - 1].color;
                for (let j = 0; j < thresholds.length - 1; j++) {
                    const low = thresholds[j], high = thresholds[j + 1];
                    if (val >= low && val <= high) {
                        const t = (val - low) / (high - low);
                        return chroma.scale([ramp[j].color, ramp[j + 1].color]).mode("lab")(t).hex();
                    }
                }
                return "#9d4edd";
            },
            async fetchPopupData(location, lngLat) {
                if (location === "") location = null;
                try {
                    var content;
                    try {
                        let res;
                        if (this.parameters.tab === "Current") {
                            this.lastProjectedData = null;

                            const toSend = {
                                pastData: this.parameters.pastData,
                                pastPeriod: this.parameters.pastPeriod,
                                lon: lngLat.lng || lngLat[0],
                                lat: lngLat.lat || lngLat[1]
                            };
                            const paramString = new URLSearchParams(toSend).toString();
                            res = await fetch(`/api/climate/pixel_value?${paramString}`);

                            if (!res.ok) throw new Error("Backend error");

                            const contentType = res.headers.get("content-type") || "";

                            if (!contentType.includes("application/json")) throw new Error("Invalid response");

                            const data = await res.json();
                            this.fetchedData = data;
                            this.$emit("data-fetched", data);
                            content = `${location ? `<strong>${location}</strong><br/>` : ''}Grid Value: ${data.value !== null && data.value !== undefined ? `${data.value}${this.unit}` : "N/A"}`;
                        }
                        else if (this.parameters.tab === "Projected") {
                            if (location === null) {
                                if (this.currentPopup) {
                                    this.currentPopup.remove();
                                    this.currentPopup = null;
                                    this.$emit("data-fetched", null);
                                }
                                return;
                            }
                            content = `<strong>${location}</strong><br>Provincial Value: ${this.provincialValueMap[location]}${this.unit}`;

                            const params = new URLSearchParams({
                                province: location,
                                projectedData: this.parameters.projectedData,
                            });

                            if (this.parameters.projectedData !== this.lastProjectedData || location !== this.lastLocation || this.emptyPopup) {
                                this.lastProjectedData = this.parameters.projectedData;

                                const res = await fetch(`/api/climate/filtereddata?${params}`);

                                if (!res.ok) throw new Error("Backend error");

                                const data = await res.json();

                                this.$emit("projected-data-fetched", {
                                    data: data.mapped,
                                    yMin: this.projectedMin,
                                    yMax: this.projectedMax,
                                });
                            }
                        }
                        this.emptyPopup = false;
                    }
                    catch (err) {
                        content = '';
                        if (location) {
                            content = `<strong>${location}</strong><br/>`;
                        }
                        if (err.name === "TypeError") {
                            content += `Connection error<br/>Click again to reload`;
                            this.$emit("data-fetched", { failed: true , connectionError: true });
                        }
                        else {
                            content += `Backend error`;
                            this.$emit("data-fetched", { failed: true, connectionError: false });
                        }       
                        this.emptyPopup = true;
                    }

                    if (this.currentPopup) {
                        this.currentPopup.remove();
                        this.currentPopup = null;
                    }

                    if (content) this.currentPopup = new mapboxgl.Popup({ closeButton: false }).setLngLat(lngLat).setHTML(content).addTo(this.map);
                    if (this.parameters.tab === "Current") this.lockPixelHover({ lat: lngLat[1] || lngLat.lat, lon: lngLat[0] || lngLat.lng })

                    this.lastLocation = location;
                    this.lastPopupLngLat = lngLat;

                    if (!this.suppressEmit) {
                        this.$emit("location-changed", {
                            name: location,
                            lat: lngLat[1] || lngLat.lat,
                            lon: lngLat[0] || lngLat.lng,
                        });
                    }

                    this.$nextTick(() => {
                        this.map.resize();
                        if (this.currentPopup && this.lastPopupLngLat) {
                            this.flyToWithOffset(this.lastPopupLngLat, Math.max(this.map.getZoom(), 7));
                        }
                    });
                }
                catch (err) {
                    console.error("Popup fetch error:", err);
                }
            },
            restoreLastPopup() {
                if (this.lastLocation && this.lastPopupLngLat) {
                    this.flyToWithOffset(this.lastPopupLngLat, 7);
                    const onMoveEnd = () => {
                        this.fetchPopupData(this.lastLocation, this.lastPopupLngLat);
                        this.map.off("moveend", onMoveEnd);
                        this.suppressEmit = false;
                    };
                    this.map.on("moveend", onMoveEnd);
                }
            },
            lockPixelHover(lngLat) {
                if (!this.tifImage) return;

                const [originX, originY] = this.tifImage.getOrigin();
                const [resX, resY] = this.tifImage.getResolution();
                const x = Math.floor((lngLat.lon - originX) / resX);
                const y = Math.floor((lngLat.lat - originY) / resY);
                const width = this.tifImage.getWidth();
                const height = this.tifImage.getHeight();

                if (x < 0 || y < 0 || x >= width || y >= height) return;

                this.legendHoveredValue = this.tifBand[y * width + x];

                const left = +(originX + x * resX).toFixed(6);
                const right = +(left + resX).toFixed(6);
                const top = +(originY + y * resY).toFixed(6);
                const bottom = +(top + resY).toFixed(6);

                this.selectedFeature = {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [[[left, top], [right, top], [right, bottom], [left, bottom], [left, top]]]
                    },
                    properties: { outline: "selected" }
                };

                const features = [];
                if (this.hoverFeature) features.push(this.hoverFeature);
                if (this.selectedFeature && this.currentPopup) features.push(this.selectedFeature);

                const src = this.map.getSource("tif-highlight");
                if (src) src.setData({ type: "FeatureCollection", features });
            },
            flyToWithOffset(lngLat, zoom, offsetY = 87) {
                const point = this.map.project(lngLat);
                point.y -= offsetY;
                const adjustedLngLat = this.map.unproject(point);
                this.map.flyTo({
                    center: adjustedLngLat,
                    zoom: Math.max(this.map.getZoom(), zoom)
                });
            }
        },
        mounted() {
            mapboxgl.accessToken = this.token;
            this.map = new mapboxgl.Map({
                container: "map",
                style: "mapbox://styles/mapbox/streets-v12",
                center: [121.774, 12.8797],
                zoom: 7
            });
            this.map.addControl(new mapboxgl.NavigationControl());

            this.map.on("load", () => {
                this.map.addSource("dynamic-source", {
                    type: "vector",
                    url: this.tileset,
                });
                this.map.addLayer({
                    id: "dynamic-layer",
                    type: "fill",
                    source: "dynamic-source",
                    "source-layer": this.sourceLayer,
                    paint: { "fill-color": "#4dabf7", "fill-opacity": 0 },
                });
                this.map.addLayer({
                    id: "dynamic-layer-outline",
                    type: "line",
                    source: "dynamic-source",
                    "source-layer": this.sourceLayer,
                    paint: { "line-color": "#1c3d5a", "line-width": 2, "line-opacity": 1.0 },
                });
                this.map.addSource("tif-highlight", {
                    type: "geojson",
                    data: { type: "FeatureCollection", features: [] }
                });
                this.map.addLayer({
                    id: "tif-highlight-layer",
                    type: "line",
                    source: "tif-highlight",
                    paint: {
                        "line-color": "#FFFF00",
                        "line-width": 2
                    }
                });
            });

            this.map.on("click", async (e) => {
                let features = [];

                features = this.map.queryRenderedFeatures(e.point, {
                    layers: ["dynamic-layer"],
                });

                let pixelMode = false;
                if (!features.length && this.map.getLayer("tif-layer")) {
                    const tifFeatures = this.map.queryRenderedFeatures(e.point, {
                        layers: ["tif-layer"],
                    });

                    if (tifFeatures.length) {
                        const pixelGeom = tifFeatures[0].geometry;
                        const bounds = pixelGeom.coordinates[0];
                        const xs = bounds.map(coord => this.map.project(coord).x);
                        const ys = bounds.map(coord => this.map.project(coord).y);
                        const minX = Math.min(...xs), maxX = Math.max(...xs);
                        const minY = Math.min(...ys), maxY = Math.max(...ys);

                        const bbox = [[minX, minY], [maxX, maxY]];
                        features = this.map.queryRenderedFeatures(bbox, {
                            layers: ["dynamic-layer"],
                        });

                        pixelMode = true;
                    }
                }

                if (!features.length) {
                    if (this.currentPopup) {
                        this.currentPopup.remove();
                        this.currentPopup = null;
                        this.admValue = null;
                    }
                    this.$emit("location-changed", null);
                    this.selectedFeature = null;
                    return;
                }

                if (this.currentPopup) {
                    this.currentPopup.remove();
                    this.currentPopup = null;
                }

                const feature = features[0];

                if (pixelMode) {
                    this.admValue = null;
                }
                else {
                    this.admValue = feature?.properties?.[this.admProperty] ?? null;
                }

                if (!this.admValue && !pixelMode) {
                    this.currentPopup = new mapboxgl.Popup({ closeButton: true })
                        .setLngLat(e.lngLat)
                        .setHTML(`Polygon has no property "${this.admProperty}"`)
                        .addTo(this.map);
                    this.$emit("location-changed", null);
                    return;
                }

                this.fetchPopupData(this.admValue, e.lngLat);
                this.flyToWithOffset(e.lngLat, Math.max(this.map.getZoom(), 7));
            });

            this.map.once("idle", () => {
                this.$emit("map-ready");
            });
        },
        beforeUnmount() {
            if (this.map) this.map.remove();
        },
    };
</script>

<style scoped>
    .map-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    #map {
        width: 100%;
        height: 100%;
        color: black !important;
    }

    .legend-overlay {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1;
        box-shadow: 0 0 0 2px #0000001a;
        background-color: white;
        max-width: min(425px, calc(100% - 70px));
        border-radius: 4px;
    }

    .missing-message {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1;
        box-shadow: 0 0 0 2px #0000001a;
        background-color: white;
        padding: 2px;
        color: #d9534f;
        font-weight: bold;
        border-radius: 4px;
    }
</style>