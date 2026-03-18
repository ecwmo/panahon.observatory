<template>
    <div class="app-layout">
        <div class="leftSide">
            <ClimateSelector v-if="showSelector"
                             @selection-changed="handleSelection"
                             :external-location="selectedLocation"
                             :mapReady="mapReady" />
        </div>
        <div class="rightSide" :class="parameters.tab === 'Current' ? 'row-layout' : 'column-layout'">
            <div class="map-container">
                <Mapbox @current-data-fetched="handleCurrentData"
                        @projected-data-fetched="handleProjectedData"
                        :parameters="parameters"
                        :token="token"
                        :tileset="tileset"
                        :source-layer="sourceLayer"
                        :adm-property="admProperty"
                        @location-changed="onLocationChanged"
                        :selected-location="selectedLocation"
                        @map-ready="onMapReady" />
            </div>
            <div v-if="selectedLocation && parameters.tab === 'Current' && currentData" ref="panel" class="panel-container">
                <CurrentGraph v-if="panelReady" :data="currentData" />
            </div>
            <div v-if="selectedLocation?.name && parameters.tab === 'Projected' && filteredData" ref="panel" class="panel-container">
                <GraphProjection :selectedProvince="selectedLocation?.name"
                                 :filteredData="filteredData"
                                 :projectedData="parameters.projectedData"
                                 :yMin="projectedMin"
                                 :yMax="projectedMax" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, nextTick, onMounted } from 'vue';
    import ClimateSelector from './ClimateSelector.vue';
    import Mapbox from './Mapbox.vue';
    import CurrentGraph from './CurrentGraph.vue';
    import GraphProjection from './GraphProjection.vue';

    defineProps<{
        token: string;
        tileset: string;
        sourceLayer: string;
        admProperty: string;
    }>();

    const parameters = ref <any> ({});
    const currentData = ref <any> (null);
    const filteredData = ref <any> (null);
    const projectedMin = ref <number | null> (null);
    const projectedMax = ref <number | null> (null);

    const showSelector = ref(false);
    const selectedLocation = ref <any> (null);
    const panelReady = ref(false);
    const mapReady = ref(false);

    function onMapReady(): void {
        mapReady.value = true;
    }

    function handleSelection(data: any): void {
        parameters.value = data || {};
    }

    function handleCurrentData(data: any): void {
        currentData.value = data;
    }

    function handleProjectedData(payload: { data: any; yMin: number; yMax: number }): void {
        filteredData.value = payload.data;
        projectedMin.value = payload.yMin;
        projectedMax.value = payload.yMax;
    }

    async function onLocationChanged(loc: any): Promise<void> {
        if (selectedLocation.value?.name !== loc?.name) {
            selectedLocation.value = loc;
            panelReady.value = false;
            await nextTick();
            requestAnimationFrame(() => {
                panelReady.value = true;
            });
        }
    }

    onMounted(() => {
        showSelector.value = true;
    });
</script>

<style scoped>
    .app-layout {
        display: flex;
        flex-direction: row;
        height: 100%;
        overflow: hidden;
    }

    .leftSide {
        flex: 1;
    }

    .rightSide {
        flex: 8;
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
        min-height: 325px;
    }

    .panel-container {
        flex-basis: 0;
        min-height: 0;
        overflow-y: auto;
    }

    /* Mobile / tight view: stack vertically and allow scroll */
    @media (max-width: 768px) {
        .app-layout {
            flex-direction: column; /* leftSide on top, rightSide below */
            height: auto; /* let it grow naturally */
            overflow-y: auto; /* whole layout scrolls */
        }

        .leftSide,
        .rightSide {
            flex: none;
            width: 100%;
        }

        .rightSide {
            display: flex;
            flex-direction: column;
        }

        .map-container {
            flex: none;
            width: 100%;
            height: 50vh; /* proportional height so map is visible */
        }

        .panel-container {
            flex: none;
            width: 100%;
            overflow-y: visible; /* allow natural growth */
            max-height: none; /* remove height cap */
        }

        /* Hide empty rightSide when no content */
        .rightSide:empty {
            display: none;
        }
    }
</style>