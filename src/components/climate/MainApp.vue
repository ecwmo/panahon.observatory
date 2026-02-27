<template>
  <div class="app-layout">
    <div class="leftSide">
      <ClimateSelector
        v-if="showSelector"
        @selection-changed="handleSelection"
        :external-location="selectedLocation"
        :mapReady="mapReady"
      />
    </div>
    <div class="rightSide" :class="parameters.tab === 'Current' ? 'row-layout' : 'column-layout'">
      <div class="map-container">
        <Mapbox
          @data-fetched="handleData"
          @projected-data-fetched="handleProjectedData"
          :parameters="parameters"
          :token="token"
          :tileset="tileset"
          :source-layer="sourceLayer"
          :adm-property="admProperty"
          @location-changed="onLocationChanged"
          :selected-location="selectedLocation"
          @map-ready="onMapReady"
        />
      </div>
      <div v-if="selectedLocation && parameters.tab === 'Current' && latestData" ref="panel" class="panel-container">
        <CurrentGraph v-if="panelReady" :data="latestDataSafe" />
      </div>
      <div v-if="selectedLocation?.name && parameters.tab === 'Projected' && filteredData" ref="panel" class="panel-container">
        <GraphProjection :selectedProvince="selectedLocation?.name" :filteredData="filteredData" :projectedData="parameters.projectedData" :yMin="projectedMin" :yMax="projectedMax"/>
      </div>
    </div>
  </div>
</template>

<script>
    import { nextTick } from 'vue'
    import ClimateSelector from './ClimateSelector.vue'
    import Mapbox from './Mapbox.vue'
    import CurrentGraph from './CurrentGraph.vue'
    import GraphProjection from './GraphProjection.vue'

    export default {
    name: 'MainApp',
    components: { ClimateSelector, Mapbox, CurrentGraph, GraphProjection },
    props: {
        token: { type: String, required: true },
        tileset: { type: String, required: true },
        sourceLayer: { type: String, required: true },
        admProperty: { type: String, required: true },
    },
    data() {
        return {
        parameters: {},
        latestData: null,
        filteredData: null,
        projectedMin: null,   
        projectedMax: null,
        showSelector: false,
        selectedLocation: null,
        panelReady: false,
        mapReady: false,
        }
    },
    computed: {
        latestDataSafe() {
        return this.latestData
        },
    },
    watch: {
        async 'parameters.tab'(newVal) {
        if (newVal === 'Projected' && this.selectedLocation) {
            this.panelReady = false
            await nextTick()
            requestAnimationFrame(() => {
            this.panelReady = true
            })
        }
        },
        async 'parameters.projectedData'(newVal, oldVal) {
        if (this.parameters.tab === 'Projected' && this.selectedLocation && newVal !== oldVal) {
            this.panelReady = false
            await nextTick()
            requestAnimationFrame(() => {
            this.panelReady = true
            })
        }
        },
    },
    methods: {
        onMapReady() {
        this.mapReady = true
        },
        handleData(data) {
        this.latestData = data
        },
        handleSelection(data) {
        this.parameters = data || {}
        },
        async onLocationChanged(loc) {
        var changeData = true
        if (this.selectedLocation?.name === loc?.name) {
            changeData = false
        }
        this.selectedLocation = loc
        this.panelReady = false
        await nextTick()
        requestAnimationFrame(() => {
            this.panelReady = true
        })
        },
        handleProjectedData(payload) {
          console.log('[Projected Data Fetched]', payload)
          this.filteredData = payload.data;
          this.projectedMin = payload.yMin;
          this.projectedMax = payload.yMax;
        },
    },
    mounted() {
        this.$nextTick(() => {
        this.showSelector = true
        })
    },
    }
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