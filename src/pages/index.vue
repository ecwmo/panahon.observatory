<template>
  <div
    class="w-full h-screen bg-gray-300 border border-t-0 border-black flex flex-col md:flex-row items-center justify-center md:gap-4 md:p-4"
  >
    <MapBox :accessToken="mapAccessToken" v-model:activeVariable="activeVariable" class="w-full md:w-1/2 h-full" />
    <div
      class="hidden md:w-1/2 md:h-full md:flex md:flex-col justify-center items-center text-sm text-center gap-2 md:gap-4"
    >
      <div class="flex flex-col md:items-start w-full mb-6">
        <div class="text-lg font-semibold">{{ stationStore.stationName }}</div>
        <div class="text-base italic font-light">
          {{ `as of ${stationStore.dateString()}` }}
        </div>
      </div>
      <InfoPanel v-model="activeVariable" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const mapAccessToken = <string>import.meta.env.VITE_MAPBOX_TOKEN
  const activeVariable = ref('temp')

  const stationStore = useStationStore()
</script>
