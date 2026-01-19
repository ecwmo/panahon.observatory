<template>
    <div id="map"></div>
</template>

<script>
    import mapboxgl from "mapbox-gl";
    import "mapbox-gl/dist/mapbox-gl.css";
    import { fromArrayBuffer } from "geotiff";

    export default {
        name: "MapboxMap",
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
                lastPopupLngLat: null
            };
        },
        watch: {
            'parameters.tab'(){
                this.$nextTick(() => {
                    if (this.currentPopup && this.lastPopupLngLat) {
                        this.map.resize();
                        this.map.flyTo({
                            center: this.lastPopupLngLat,
                            zoom: Math.max(this.map.getZoom(), 7)
                        });
                    }
                });
            },
            parameters(newVal, oldVal) {
                if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
                    this.restoreLastPopup();
                    return;
                }

                const { location: newLocation, ...newParams } = newVal || {};
                const { location: oldLocation, ...oldParams } = oldVal || {};

                var gotNewData = false;

                if (JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
                    this.renderTif(newParams);
                    if (newLocation) {
                        let lngLat;
                        if (this.currentPopup) {
                            const pos = this.currentPopup.getLngLat();
                            lngLat = [pos.lng, pos.lat];
                        } else {
                            lngLat = [parseFloat(newLocation.Lon), parseFloat(newLocation.Lat)];
                        }
                        this.fetchPopupData(newLocation.ADM2_EN, lngLat);
                        gotNewData = true;
                    }
                }

                if (newLocation && (!oldLocation || newLocation.ADM2_EN !== oldLocation.ADM2_EN)) {
                    const lngLat = [parseFloat(newLocation.Lon), parseFloat(newLocation.Lat)];
                    this.admValue = newLocation.ADM2_EN;
                    this.suppressEmit = true;
                    this.map.flyTo({ center: lngLat, zoom: 7 });
                    const onMoveEnd = () => {
                        if (!gotNewData) {
                            this.fetchPopupData(this.admValue, lngLat);
                            this.map.off("moveend", onMoveEnd);
                        }
                        this.suppressEmit = false;
                    };
                    this.map.on("moveend", onMoveEnd);
                }
            },
            selectedLocation(newVal, oldVal) {
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
            }
        },
        methods: {
            async renderTif(newParams) {
                try {
                    const toSend = {};

                    if (newParams.tab === "Current") {
                        Object.assign(toSend, {
                            pastData: newParams.pastData,
                            pastPeriod: newParams.pastPeriod
                        });
                    } else if (newParams.tab === "Projected") {
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
                            : "/api/climate/projected_tif";

                    const res = await fetch(`${endpoint}?${paramString}`);

                    if (!res.ok) {
                        throw new Error(`Bad response: ${res.status}`);
                    }

                    const arrayBuffer = await res.arrayBuffer();
                    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                        throw new Error("Empty TIFF buffer");
                    }

                    const tiff = await fromArrayBuffer(arrayBuffer);
                    const image = await tiff.getImage();
                    const raster = await image.readRasters();
                    const band = raster[0];

                    if (!band || band.length === 0) {
                        throw new Error("Invalid TIFF band data");
                    }

                    const width = image.getWidth();
                    const height = image.getHeight();

                    let min = Infinity,
                        max = -Infinity;
                    for (let i = 0; i < band.length; i++) {
                        const val = band[i];
                        if (typeof val !== "number" || isNaN(val)) continue;
                        if (val < min) min = val;
                        if (val > max) max = val;
                    }

                    if (!isFinite(min) || !isFinite(max) || min === max) {
                        throw new Error("Invalid min/max values in TIFF");
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    const imgData = ctx.createImageData(width, height);

                    for (let i = 0; i < band.length; i++) {
                        const val = band[i];
                        if (typeof val !== "number" || isNaN(val)) continue;
                        const ratio = (val - min) / (max - min);
                        const r = Math.floor(255 * ratio);
                        imgData.data[i * 4 + 0] = r;
                        imgData.data[i * 4 + 1] = 0;
                        imgData.data[i * 4 + 2] = 0;
                        imgData.data[i * 4 + 3] = 255;
                    }
                    ctx.putImageData(imgData, 0, 0);

                    const bbox = image.getBoundingBox();
                    const coords = [
                        [bbox[0], bbox[3]],
                        [bbox[2], bbox[3]],
                        [bbox[2], bbox[1]],
                        [bbox[0], bbox[1]]
                    ];

                    if (this.map.getLayer("tif-layer")) this.map.removeLayer("tif-layer");
                    if (this.map.getSource("tif-source")) this.map.removeSource("tif-source");

                    this.map.addSource("tif-source", {
                        type: "image",
                        url: canvas.toDataURL(),
                        coordinates: coords
                    });

                    this.map.addLayer({
                        id: "tif-layer",
                        type: "raster",
                        source: "tif-source",
                        paint: { "raster-opacity": 0.7 }
                    });
                } catch (err) {
                    console.error("Error rendering tif:", err);
                    if (this.map.getLayer("tif-layer")) this.map.removeLayer("tif-layer");
                    if (this.map.getSource("tif-source")) this.map.removeSource("tif-source");
                }
            },
            async fetchPopupData(location, lngLat) {
                try {
                    const flatParams = Object.fromEntries(
                        Object.entries(this.parameters || {}).map(([k, v]) => [k, String(v)])
                    );

                    let toSend = {};

                    if (this.parameters.tab === "Current") {
                        Object.assign(toSend, {
                            pastData: this.parameters.pastData,
                            pastPeriod: this.parameters.pastPeriod,
                            location
                        });
                    }
                    else if (this.parameters.tab === "Projected") {
                        Object.assign(toSend, {
                            projectedData: this.parameters.projectedData,
                            projectedPeriod: this.parameters.projectedPeriod,
                            scenario: this.parameters.scenario,
                            location
                        });
                    }

                    const endpoint = this.parameters.tab === "Current" ? "/api/climate/current_average" : "/api/climate/projected_average";
                    const paramString = new URLSearchParams(toSend).toString();
                    let content = null;

                    try {
                        console.log(paramString);
                        const res = await fetch(`${endpoint}?${paramString}`);
                        if (!res.ok) {
                            content = `<strong>${location}</strong><br/>Backend error`;
                            this.$emit("data-fetched", null);
                        }
                        else {
                            const contentType = res.headers.get("content-type") || "";
                            if (contentType.includes("application/json")) {
                                const data = await res.json();
                                this.fetchedData = data;
                                this.$emit("data-fetched", data);
                                content = data && data.location ? `<strong>${data.location}</strong><br/>Value: ${data.value ?? "N/A"}` : "No data found";
                            }
                            else {
                                content = `<strong>${location}</strong><br/>Backend error`;
                                this.$emit("data-fetched", null);
                            }
                        }
                    }
                    catch (err) {
                        content = `<strong>${location}</strong><br/>Backend error`;
                        this.$emit("data-fetched", null);
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
                            ADM2_EN: location,
                            Lat: lngLat[1],
                            Lon: lngLat[0],
                        });
                    }
                } catch (err) {
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
                    paint: { "line-color": "#1c3d5a", "line-width": 4, "line-opacity": 1.0 },
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
    #map {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    * {
        color: black !important;
    }
</style>