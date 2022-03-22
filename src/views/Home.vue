<template>
  <div class="bg-gray-300 border border-t-0 border-black flex flex-col items-center">
    <div class="w-full flex flex-col md:flex-row bg-gray-400 border-b border-black text-xs p-3 gap-2 content-center">
      <!-- Map Switcher -->
      <div class="flex gap-1.5">
        <span class="hidden md:block">Map:</span>
        <label class="inline-flex items-center">
          <input type="radio" class="h-3 w-3" v-model="mapScope" value="ph" /><span class="ml-1">Philippines</span>
        </label>
        <label class="inline-flex items-center">
          <input type="radio" class="h-3 w-3" v-model="mapScope" value="mm" /><span class="ml-1">Metro Manila</span>
        </label>
      </div>
      <!-- Station Dropdown -->
      <select v-model="activeStationId">
        <option v-for="(st, id) in visibleStations" :key="id" :value="st.properties.id">
          {{ st.properties.name }}
        </option>
      </select>
    </div>
    <div class="w-full flex flex-col-reverse md:flex-row md:items-center justify-center gap-4 p-6">
      <div v-show="screen.width > 768" ref="mapContainer" class="flex relative" :style="mapStyle">
        <MapBox
          class="flex md:flex md:flex-col m-auto md:mx-0 md:w-full md:h-full"
          v-if="mapAccessToken"
          :accessToken="mapAccessToken"
          :data="stationLayer"
          :activeVariable="activeVariable"
          :mapScope="mapScope"
          v-model:activeStationId="activeStationId"
          v-model:visibleStations="visibleStations"
          v-model:loaded="mapIsLoaded"
        />
        <loading :active="!mapIsLoaded" :is-full-page="false" />
      </div>
      <div class="flex text-sm text-center items-center justify-center">
        <div class="flex flex-col items-center gap-2 md:gap-4">
          <div class="flex flex-col md:items-start w-full">
            <div class="text-lg font-semibold">{{ activeStation.name }}</div>
            <div class="text-base italic font-light">{{ `as of ${formatDate()}` }}</div>
          </div>
          <InfoPanel :data="activeStation" :timestamp="timeStamp" v-model="activeVariable" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, defineAsyncComponent, ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import { format } from 'date-fns'

  import { useScreen } from 'vue-screen'

  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/vue-loading.css'

  import { StationLayer, formatStnLayer } from '@/scripts/weather'

  import Header from '@/components/Header.vue'

  const MapBox = defineAsyncComponent({ loader: () => import('@/components/MapBox.vue') })
  const InfoPanel = defineAsyncComponent({ loader: () => import('@/components/InfoPanel.vue') })

  export default defineComponent({
    components: { Header, Loading, MapBox, InfoPanel },
    setup() {
      const screen = useScreen()
      const defaultStationId = '1'
      const timeStamp = ref(new Date())
      const mapAccessToken = ref('')
      const mapIsLoaded = ref(false)
      const mapContainer = ref()
      const mapScope = ref('mm')
      const stationObs = ref({})
      const stationLayer = ref(<StationLayer>{})
      const activeStationId = ref(defaultStationId)
      const activeVariable = ref('temp')
      const visibleStations = ref(<StationLayer['features']>[])

      const activeStation = computed(() => {
        if (visibleStations.value !== undefined) {
          const st = visibleStations.value.find(({ properties: { id } }) => id === activeStationId.value)
          if (st !== undefined) {
            return st.properties
          }
        }
        return { id: '', name: '', obs: {} }
      })

      const formatDate = (strFormat = 'MMMM d, yyyy h:00 bbb') => format(timeStamp.value, strFormat)

      const mapStyle = computed(() => {
        const aspectRatio = 1.2
        const maxHeight = 540
        let mapHeight = screen.height
        mapHeight = mapHeight > maxHeight ? maxHeight : mapHeight
        const mapWidth = mapHeight / aspectRatio
        return `height:${mapHeight}px;width:${mapWidth}px;`
      })

      onMounted(async () => {
        mapAccessToken.value = await axios.post('api/env.php', { token: 'mapbox' }).then(({ data: tok }) => tok)

        const rawData = await axios.get('/api/stations.php').then(({ data }) => data)
        timeStamp.value = new Date(rawData['0'].obs.timestamp)
        stationLayer.value = formatStnLayer(rawData)
        visibleStations.value = stationLayer.value.features
      })

      return {
        mapAccessToken,
        mapContainer,
        mapStyle,
        mapIsLoaded,
        mapScope,
        stationLayer,
        visibleStations,
        activeStationId,
        activeStation,
        activeVariable,
        timeStamp,
        formatDate,
        screen,
      }
    },
  })
</script>
