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
      <Suspense>
        <MapBox
          v-show="stationLayer"
          class="w-full md:w-1/2 h-full"
          :accessToken="mapAccessToken"
          :data="stationLayer"
          :mapScope="mapScope"
          v-model:activeVariable="activeVariable"
          v-model:activeStationId="activeStationId"
        />
        <template #fallback>
          <div class="relative w-full md:w-1/2 h-full">
            <loading :active="true" :isFullPage="false"></loading>
          </div>
        </template>
      </Suspense>
      <div
        class="hidden md:w-1/2 md:h-full md:flex md:flex-col justify-center items-center text-sm text-center gap-2 md:gap-4"
      >
        <div class="flex flex-col md:items-start w-full">
          <div class="text-lg font-semibold">{{ activeStation.name }}</div>
          <div class="text-base italic font-light">
            {{ `as of ${dateString}` }}
          </div>
        </div>
        <InfoPanel :data="activeStation" :timestamp="timestamp" v-model="activeVariable" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineAsyncComponent, ref, computed, watch, onMounted } from 'vue'

  import Loading from 'vue-loading-overlay'

  import { StationLayer } from '@/composables/useWeather'
  import useDate from '@/composables/useDate'
  import useWeather from '@/composables/useWeather'
  import useLocation from '@/composables/useLocation'

  const MapBox = defineAsyncComponent({ loader: () => import('@/components/MapBox.vue') })
  const InfoPanel = defineAsyncComponent({ loader: () => import('@/components/InfoPanel.vue') })

  const mapAccessToken = <string>import.meta.env.VITE_MAPBOX_TOKEN
  const mapScope = ref('mm')
  const activeStationId = ref(1)
  const activeVariable = ref('temp')

  const { formatDate } = useDate()
  const { data: stationData, status: stationDataStatus } = useWeather()
  const { data: userPosition, status: positionStatus } = useLocation()

  const stationLayer = computed(() => stationData.value ?? <StationLayer>{})

  const activeStation = computed(
    () =>
      stationLayer.value?.features?.find(({ properties: { id } }) => id === activeStationId.value)?.properties ?? {
        id: '',
        name: '',
        obs: { timestamp: null },
      }
  )

  const timestamp = computed(() => new Date(activeStation.value?.obs?.timestamp))
  const dateString = computed(() => formatDate(timestamp.value, 'MMMM d, yyyy h:00 bbb'))

  const getClosestPoint = () => {
    if (positionStatus.value == 'success' && positionStatus.value == 'success') {
      const { latitude: userLat, longitude: userLng } = userPosition.value
      const d =
        stationLayer.value?.features?.map(
          ({ geometry: { coordinates } }) =>
            Math.pow(coordinates[0] - userLng, 2) + Math.pow(coordinates[1] - userLat, 2)
        ) ?? []
      const i = d.indexOf(Math.min(...d))
      activeStationId.value = stationLayer.value?.features?.[i].properties.id ?? 1
    }
  }

  watch([positionStatus, stationDataStatus], getClosestPoint)
  onMounted(getClosestPoint)
</script>
