<template>
    <div class="app-layout">
        <div class="leftSide">
            <ClimateSelector v-if="showSelector"
                             @selection-changed="handleSelection"
                             :external-location="selectedLocation" />
        </div>
        <div class="rightSide" :class="parameters.tab === 'Current' ? 'row-layout' : 'column-layout'">
            <div class="map-container">
                <Mapbox @data-fetched="handleData"
                        :parameters="parameters"
                        :token="token"
                        :tileset="tileset"
                        :source-layer="sourceLayer"
                        :adm-property="admProperty"
                        @location-changed="onLocationChanged"
                        :selected-location="selectedLocation" />
            </div>
            <div v-show="selectedLocation" ref="panel" class="panel-container">
                <span v-if="parameters.tab === 'Current'">
                    <CurrentGraph v-if="panelReady" :data="latestDataSafe" />
                </span>
                <span v-else>
                    <GraphProjection 
                        v-if="panelReady"
                        :selectedProvince="selectedLocation?.name" 
                        :filteredData="filteredData"
                    />
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import { nextTick } from "vue";
    import ClimateSelector from "./ClimateSelector.vue";
    import Mapbox from "./Mapbox.vue";
    import CurrentGraph from "./CurrentGraph.vue";
    import GraphProjection from './GraphProjection.vue'

    export default {
        name: "MainApp",
        components: { ClimateSelector, Mapbox, CurrentGraph, GraphProjection },
        props: {
            token: { type: String, required: true },
            tileset: { type: String, required: true },
            sourceLayer: { type: String, required: true },
            admProperty: { type: String, required: true }
        },
        data() {
            return {
                parameters: {},
                latestData: null,
                filteredData: null,
                showSelector: false,
                selectedLocation: null,
                panelReady: false
            };
        },
        computed: {
            latestDataSafe() {
                return this.latestData;
            }
        },
        methods: {
            handleData(data) {
                this.latestData = data;
            },
            handleSelection(data) {
                this.parameters = data || {};
            },
            async onLocationChanged(loc) {
                this.selectedLocation = loc;
                this.panelReady = false;
                if (this.parameters.tab !== 'Current') {
                    await this.fetchFilteredData(); // fetch filtered data only when tab is not Current
                }
                await nextTick();
                requestAnimationFrame(() => {
                    this.panelReady = true;
                });
            },
            async fetchFilteredData() {
                if (!this.selectedLocation.name) return;

                const params = new URLSearchParams({
                    province: this.selectedLocation.name
                });

                try {
                    const res = await fetch(`/api/climate/filtereddata?${params}`);
                    const data = await res.json();
                    this.filteredData = data.mapped; // <-- reactive, for GraphProjection
                }
                catch (err) {
                    console.error('Failed to fetch filtered data:', err);
                }
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.showSelector = true;
            });
        }
    };
</script>

<style scoped>
    .app-layout {
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    .leftSide {
        flex: 1;
    }

    .rightSide {
        flex: 4;
        display: flex;
        min-height: 0;
    }

    /* layout variants */
    .row-layout {
        flex-direction: row; /* map and graph side by side */
    }

    .column-layout {
        flex-direction: column; /* map on top, graph below */
    }

    /* ratios for row layout (left to right) */
    .rightSide.row-layout .map-container {
        flex: 3;
    }

    .rightSide.row-layout .panel-container {
        flex: 2;
    }

    /* ratios for column layout (top down) */
    .rightSide.column-layout .map-container {
        flex: 5;
    }

    .rightSide.column-layout .panel-container {
        flex: 5;
        overflow-y: auto;
    }

    .map-container {
        min-height: 0;
    }

    .panel-container {
        flex-basis: 0;
        min-height: 0;
        overflow-y: auto;
    }
</style>