<template>
  <div
    class="w-full h-screen bg-gray-300 border border-t-0 border-black flex flex-col md:flex-row items-center justify-center md:gap-4 md:p-4"
  >
    <Suspense>
      <MapBox
        v-if="stationDataIsReady"
        class="w-full md:w-1/2 h-full"
        :accessToken="mapAccessToken"
        :data="stationData"
        v-model:activeVariable="activeVariable"
        v-model:activeStationId="activeStationId"
      />
      <template #fallback>
        <LoadingIcon class="w-full md:w-1/2 h-full" svgClass="w-16 h-16 text-slate-500" />
      </template>
    </Suspense>
    <div
      class="hidden md:w-1/2 md:h-full md:flex md:flex-col justify-center items-center text-sm text-center gap-2 md:gap-4"
    >
      <div class="flex flex-col md:items-start w-full mb-6">
        <div class="text-lg font-semibold">{{ activeStation?.name }}</div>
        <div class="text-base italic font-light">
          {{ `as of ${dateString}` }}
        </div>
      </div>
      <InfoPanel :data="activeStation" :timestamp="timestamp" v-model="activeVariable" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineAsyncComponent, ref, computed, watchEffect } from 'vue'

  import useDate from '@/composables/useDate'
  import useWeather from '@/composables/useWeather'
  import useLocation from '@/composables/useLocation'

  import LoadingIcon from '@/LoadingIcon.vue'

  const MapBox = defineAsyncComponent({ loader: () => import('@/components/MapBox.vue') })
  const InfoPanel = defineAsyncComponent({ loader: () => import('@/components/InfoPanel.vue') })

  const mapAccessToken = <string>import.meta.env.VITE_MAPBOX_TOKEN
  const activeStationId = ref(1)
  const activeVariable = ref('temp')

  const { formatDate } = useDate()
  const { data: stationData, status: stationDataStatus, isSuccess: stationDataIsReady } = useWeather()
  const { data: userPosition, status: positionStatus } = useLocation()

  const activeStation = computed(
    () => stationData.value?.features?.find(({ properties: { id } }) => id === activeStationId.value)?.properties
  )

  const timestamp = computed(() => new Date(activeStation.value?.obs?.timestamp ?? Date.now()))
  const dateString = computed(() => formatDate('MMMM d, yyyy h:00 bbb', timestamp.value))

  const getClosestPoint = () => {
    if (stationDataStatus.value == 'success' && positionStatus.value == 'success') {
      const { latitude: userLat, longitude: userLng } = userPosition.value
      const d =
        stationData.value?.features?.map(
          ({ geometry: { coordinates } }) =>
            Math.pow(coordinates[0] - userLng, 2) + Math.pow(coordinates[1] - userLat, 2)
        ) ?? []
      const i = d.indexOf(Math.min(...d))
      activeStationId.value = stationData.value?.features?.[i].properties.id ?? 1
    }
  }

  watchEffect(() => {
    getClosestPoint()
  })
</script>
