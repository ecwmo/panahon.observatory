<template>
  <div
    class="w-full h-screen bg-gray-300 border border-t-0 border-black flex flex-col md:flex-row items-center justify-center md:gap-4 md:p-4"
  >
    <Suspense>
      <MapBox
        :accessToken="mapAccessToken"
        v-model:activeVariable="activeVariable"
        v-model:activeStation="activeStation"
        class="w-full md:w-1/2 h-full"
      />
      <template #fallback>
        <LoadingIcon class="w-full md:w-1/2 h-full" svgClass="w-16 h-16 text-slate-500" />
      </template>
    </Suspense>
    <div
      class="hidden md:w-1/2 md:h-full md:flex md:flex-col justify-center items-center text-sm text-center gap-2 md:gap-4"
    >
      <div class="flex flex-col md:items-start w-full mb-6">
        <div class="text-lg font-semibold">{{ activeStation?.properties?.name }}</div>
        <div class="text-base italic font-light">
          {{ `as of ${dateString}` }}
        </div>
      </div>
      <InfoPanel :data="activeStation?.properties" :timestamp="timestamp" v-model="activeVariable" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  import useDate from '@/composables/useDate'

  const mapAccessToken = <string>import.meta.env.VITE_MAPBOX_TOKEN
  const activeStation = ref()
  const activeVariable = ref('temp')

  const { formatDate } = useDate()

  const timestamp = computed(() => new Date(activeStation.value?.properties?.obs?.timestamp ?? Date.now()))
  const dateString = computed(() => formatDate('MMMM d, yyyy h:00 bbb', timestamp.value))
</script>
