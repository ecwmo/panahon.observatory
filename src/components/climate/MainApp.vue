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
                    <ProjectedGraph v-if="panelReady" :data="latestDataSafe" />
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
    import ProjectedGraph from "./ProjectedGraph.vue"

    export default {
        name: "MainApp",
        components: { ClimateSelector, Mapbox, CurrentGraph, ProjectedGraph },
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
                await nextTick();
                requestAnimationFrame(() => {
                    this.panelReady = true;
                });
            }
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
        flex: 2;
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