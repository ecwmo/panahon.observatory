<template>
  <div class="h-full flex flex-col md:flex-row items-center justify-center md:gap-4 md:p-4">
    <MapBox :access-token="mapAccessToken" class="w-full md:w-1/2 h-full z-0" />
    <div
      class="hidden md:w-1/2 md:h-full md:flex md:flex-col justify-center items-center text-sm text-center gap-2 md:gap-4"
    >
      <div class="flex flex-col md:items-start w-full mb-6">
        <div class="text-sm font-extralight">
          {{ stnStore.dateString('d MMM yyyy, h bbb') }}
        </div>
        <div class="text-3xl font-semibold">{{ stnStore.stationName }}</div>
      </div>
      <InfoPanel />
    </div>
    <ReloadPrompt />
  </div>
</template>

<script setup lang="ts">
  const mapAccessToken = import.meta.env.VITE_MAPBOX_TOKEN as string

  const stnStore = useStationStore()
</script>
