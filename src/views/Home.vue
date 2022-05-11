<template>
  <div class="flex flex-col w-full h-screen bg-gray-300 border border-t-0 border-black items-center">
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
      <select v-model="activeStationId" v-if="stationLayer?.features?.length">
        <option v-for="(st, id) in stationLayer?.features" :key="id" :value="st.properties.id">
          {{ st.properties.name }}
        </option>
      </select>
    </div>
    <div class="w-full flex-grow flex flex-col md:flex-row md:items-center justify-center md:gap-4 md:p-4">
      <div class="relative w-full md:w-1/2 h-full">
        <MapBox
          v-show="stationLayer"
          class="w-full h-full"
          :accessToken="mapAccessToken"
          :data="stationLayer"
          :activeVariable="activeVariable"
          :mapScope="mapScope"
          v-model:activeStationId="activeStationId"
          v-model:loaded="mapIsLoaded"
        />
        <loading :active="!mapIsLoaded" :is-full-page="false" />
      </div>
      <div class="hidden md:flex text-sm text-center items-center justify-center">
        <div class="flex flex-col items-center gap-2 md:gap-4">
          <div class="flex flex-col md:items-start w-full">
            <div class="text-lg font-semibold">{{ activeStation.name }}</div>
            <div class="text-base italic font-light">{{ `as of ${formatDate()}` }}</div>
          </div>
          <InfoPanel :data="activeStation" :timestamp="timestamp" v-model="activeVariable" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineAsyncComponent, ref, computed } from 'vue'
  import { format } from 'date-fns'
  import axios from 'axios'
  import { useQuery } from 'vue-query'

  import { formatStnLayer, StationLayer } from '@/scripts/weather'

  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/vue-loading.css'

  const MapBox = defineAsyncComponent({ loader: () => import('@/components/MapBox.vue') })
  const InfoPanel = defineAsyncComponent({ loader: () => import('@/components/InfoPanel.vue') })

  const mapAccessToken = <string>import.meta.env.VITE_MAPBOX_TOKEN
  const defaultStationId = '1'
  const mapIsLoaded = ref(false)
  const mapScope = ref('mm')
  const activeStationId = ref(defaultStationId)
  const activeVariable = ref('temp')

  const fetchData = async () => await axios.get('/api/stations.php').then(({ data }) => formatStnLayer(data))
  const { data } = useQuery('stationData', fetchData)

  const stationLayer = computed(() => data.value ?? <StationLayer>{})

  const activeStation = computed(
    () =>
      stationLayer.value?.features?.find(({ properties: { id } }) => id === activeStationId.value)?.properties ?? {
        id: '',
        name: '',
        obs: { timestamp: null },
      }
  )

  const timestamp = computed(() => new Date(activeStation.value?.obs?.timestamp))

  const formatDate = (strFormat = 'MMMM d, yyyy h:00 bbb') => format(timestamp.value, strFormat)
</script>
