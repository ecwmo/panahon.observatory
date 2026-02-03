<template>
    <div class="map-container">
        <div id="map"></div>
        <Legend v-if="legendStyle" :style="legendStyle" class="legend-overlay" :hoveredValue="legendHoveredValue"/>
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
                legendStyle: null,

                tifBand: null,
                tifImage: null,
                legendHoveredValue: null
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
                    this.renderClimate(newParams);
                    if (newLocation?.name && newLocation?.lon != null && newLocation?.lat != null) {
                        const lngLat = [parseFloat(newLocation.lon), parseFloat(newLocation.lat)];
                        this.fetchPopupData(newLocation.name, lngLat);
                    }
                    else if (this.currentPopup) {
                        const pos = this.currentPopup.getLngLat();
                        const lngLat = [pos.lng, pos.lat];
                        this.fetchPopupData(this.admValue || "", lngLat);
                    }
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
                        this.map.flyTo({ center: lngLat, zoom: Math.max(this.map.getZoom(), 7) });
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
                        if (this.currentPopup && this.lastPopupLngLat) {
                            this.map.flyTo({
                                center: this.lastPopupLngLat,
                                zoom: Math.max(this.map.getZoom(), 7)
                            });
                        }
                    });
                }
            },
            selectedLocation(newVal, oldVal) {
                // Keep panel layout stable when selection appears/disappears
                if ((!oldVal && newVal) || (!newVal && oldVal)) {
                    this.$nextTick(() => {
                        this.map.resize();
                        if (this.currentPopup && this.lastPopupLngLat) {
                            this.map.flyTo({
                                center: this.lastPopupLngLat,
                                zoom: Math.max(this.map.getZoom(), 7)
                            });
                        }
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
            async renderClimate(newParams) {
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

                    const res = await fetch(`${endpoint}?${paramString}`);
                    if (!res.ok) throw new Error(`Bad response: ${res.status}`);

                    const scaling = res.headers.get("X-Scaling");
                    const rampHeader = res.headers.get("X-Ramp");
                    const ramp = rampHeader ? JSON.parse(rampHeader) : [];
                    const minHeader = res.headers.get("X-Min");
                    const maxHeader = res.headers.get("X-Max");

                    if (newParams.tab === "Current") {
                        const arrayBuffer = await res.arrayBuffer();
                        const tiff = await fromArrayBuffer(arrayBuffer);
                        const image = await tiff.getImage();
                        const band = (await image.readRasters())[0];

                        const { thresholds, enrichedRamp } = this.computeThresholds(
                            band, ramp, scaling, minHeader, maxHeader
                        );
                        this.legendStyle = { ramp: enrichedRamp };

                        this.tifSource(image, band, ramp, thresholds);
                        this.tifBand = band;
                        this.tifImage = image;
                    }
                    else {
                        const response = await res.json();
                        const jsonData = response.map(d => [d.province, d.averageAnomaly]);
                        const band = jsonData.map(d => d[1]);
                        const { thresholds, enrichedRamp } = this.computeThresholds(
                            band, ramp, scaling, minHeader, maxHeader
                        );
                        this.legendStyle = { ramp: enrichedRamp };
                        this.jsonSource(jsonData, ramp, thresholds);
                    }
                }
                catch (err) {
                    console.error("Error rendering:", err);
                    if (this.map.getLayer("tif-layer")) this.map.removeLayer("tif-layer");
                    if (this.map.getSource("tif-source")) this.map.removeSource("tif-source");
                    if (this.map.getLayer("newfill")) this.map.removeLayer("newfill");
                    this.legendStyle = null;
                }
            },
            computeThresholds(band, ramp, scaling, minHeader, maxHeader) {
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
                if (!isFinite(min) || !isFinite(max) || min === max) throw new Error("Invalid min/max");
                const n = ramp.length;
                let thresholds = [];
                if (scaling === "linear") {
                    for (let i = 0; i < n; i++) thresholds.push(min + (i / (n - 1)) * (max - min));
                }
                else if (scaling === "log") {
                    const logMin = Math.log(min), logMax = Math.log(max);
                    for (let i = 0; i < n; i++) thresholds.push(Math.exp(logMin + (i / (n - 1)) * (logMax - logMin)));
                }
                else if (scaling === "quantile") {
                    const sorted = band.filter(v => typeof v === "number" && !isNaN(v)).sort((a, b) => a - b);
                    for (let i = 0; i < n; i++) {
                        const idx = Math.floor((i / (n - 1)) * (sorted.length - 1));
                        thresholds.push(sorted[idx]);
                    }
                }
                const enrichedRamp = ramp.map((entry, i) => ({ ...entry, threshold: thresholds[i] }));
                return { thresholds, enrichedRamp };
            },
            tifSource(image, band, ramp, thresholds) {
                const width = image.getWidth();
                const height = image.getHeight();
                const [originX, originY] = image.getOrigin();
                const [resX, resY] = image.getResolution();

                const features = [];
                for (let y = 0; y < height; y++) {
                    const top = originY - y * resY;
                    const bottom = top - resY;
                    for (let x = 0; x < width; x++) {
                        const left = originX + x * resX;
                        const right = left + resX;
                        const idx = y * width + x;
                        const val = band[idx];
                        if (typeof val !== "number" || isNaN(val)) continue;
                        let color = this.interpolateColor(val, ramp, thresholds);
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
                    paint: { "fill-color": ["get", "color"], "fill-opacity": 0.7 }
                });

                if (this.map.getLayer("dynamic-layer-outline")) {
                    this.map.moveLayer("dynamic-layer-outline");
                }

                if (this.map.getLayer("dynamic-layer-highlight")) {
                    this.map.moveLayer("dynamic-layer-highlight");
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
                    const y = Math.floor((originY - e.lngLat.lat) / resY);
                    const width = this.tifImage.getWidth();
                    const height = this.tifImage.getHeight();
                    if (x < 0 || y < 0 || x >= width || y >= height) {
                        this.legendHoveredValue = null;
                        return;
                    }
                    this.legendHoveredValue = this.tifBand[y * width + x];
                };

                this.map.on("mousemove", this._hoverHandler);
            },
            jsonSource(data, ramp, thresholds) {
                const matchExpression = ["match", ["get", this.admProperty]];
                const valueMap = {};

                data.forEach(([province, val]) => {
                    const color = this.interpolateColor(val, ramp, thresholds);
                    matchExpression.push(province, color);
                    valueMap[province] = val;
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
                    this.legendHoveredValue = valueMap[province];
                };

                this.map.on("mousemove", this._hoverHandler);

                if (this.map.getLayer("dynamic-layer-highlight")) {
                    this.map.moveLayer("dynamic-layer-highlight");
                }
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
                try {
                    let content;
                    try {
                        let res;
                        if (this.parameters.tab === "Current") {
                            const toSend = {
                                pastData: this.parameters.pastData,
                                pastPeriod: this.parameters.pastPeriod,
                                location
                            };
                            const paramString = new URLSearchParams(toSend).toString();
                            res = await fetch(`/api/climate/current_average?${paramString}`);

                            if (!res.ok) throw new Error("Backend error");

                            const contentType = res.headers.get("content-type") || "";

                            if (!contentType.includes("application/json")) throw new Error("Invalid response");

                            const data = await res.json();
                            this.fetchedData = data;
                            this.$emit("data-fetched", data);
                            content = data?.location ? `<strong>${data.location}</strong><br/>Value: ${data.value ?? "N/A"}` : "No data found";
                        }
                        else {
                            await Promise.reject(new Error("Projected not available"));
                        }
                    }
                    catch {
                        if (this.parameters.tab === "Projected")
                        {
                            content = `<strong>${location}</strong>`;
                            this.$emit("data-fetched", null);
                        }
                        else
                        {
                            content = `<strong>${location}</strong><br/>Backend error`;
                            this.$emit("data-fetched", { failed: true } );
                        }
                    }

                    if (this.currentPopup) {
                        this.currentPopup.remove();
                        this.currentPopup = null;
                    }

                    this.currentPopup = new mapboxgl.Popup({ closeButton: false }).setLngLat(lngLat).setHTML(content).addTo(this.map);

                    this.lastLocation = location;
                    this.lastPopupLngLat = lngLat;

                    if (!this.suppressEmit) {
                        this.$emit("location-changed", {
                            name: location,
                            lat: lngLat[1],
                            lon: lngLat[0],
                        });
                    }
                }
                catch (err) {
                    console.error("Popup fetch error:", err);
                }
            },
            restoreLastPopup() {
                if (this.lastLocation && this.lastPopupLngLat) {
                    this.map.flyTo({ center: this.lastPopupLngLat, zoom: 7 });
                    const onMoveEnd = () => {
                        this.fetchPopupData(this.lastLocation, this.lastPopupLngLat);
                        this.map.off("moveend", onMoveEnd);
                        this.suppressEmit = false;
                    };
                    this.map.on("moveend", onMoveEnd);
                }
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
            });

            this.map.on("click", async (e) => {
                const features = this.map.queryRenderedFeatures(e.point, {
                    layers: ["dynamic-layer"],
                });

                if (!features.length) {
                    if (this.currentPopup) {
                        this.currentPopup.remove();
                        this.currentPopup = null;
                        this.admValue = null;
                    }
                    this.$emit("location-changed", null); // only emit blank for empty click
                    return;
                }

                if (this.currentPopup) {
                    this.currentPopup.remove();
                    this.currentPopup = null;
                }

                const feature = features[0];
                this.admValue = feature?.properties?.[this.admProperty] ?? null;

                if (!this.admValue) {
                    this.currentPopup = new mapboxgl.Popup({ closeButton: true })
                        .setLngLat(e.lngLat)
                        .setHTML(`Polygon has no property "${this.admProperty}"`)
                        .addTo(this.map);
                    this.$emit("location-changed", null); // only emit blank for invalid polygon
                    return;
                }

                // valid polygon -> fetch data and emit location inside fetchPopupData
                this.fetchPopupData(this.admValue, e.lngLat);
                this.map.flyTo({ center: e.lngLat, zoom: Math.max(this.map.getZoom(), 7) });
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
    }

    .legend-overlay {
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 1;
    }

    * {
        color: black !important;
    }
</style>