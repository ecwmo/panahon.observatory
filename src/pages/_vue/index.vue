<template>
  <div class="h-full flex flex-col md:flex-row items-center justify-center md:gap-4 md:p-4">
    <MapBox class="w-full md:w-1/2 h-full z-0" :token="mapboxToken" />
    <div
      class="hidden md:w-1/2 md:h-full md:flex md:flex-col justify-center items-center text-sm text-center gap-2 md:gap-4"
    >
      <div class="flex flex-col md:items-start w-full mb-6">
        <div class="text-sm font-extralight">
          {{ dataTsString }}
        </div>
        <div class="text-3xl font-semibold">{{ stationName }}</div>
      </div>
      <InfoPanel />
    </div>
    <!-- <ReloadPrompt /> -->
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { format } from 'date-fns'
  import 'mapbox-gl/dist/mapbox-gl.css'

  import { activeStation, setViewType, timestamp } from '@/stores/station'

  interface Props {
    mapboxToken: string
  }
  defineProps<Props>()

  const dataTimestamp = useStore(timestamp)
  const activeStn = useStore(activeStation)

  setViewType('default')

  const stationName = computed(() => activeStn.value.name)
  const dataTsString = computed(() => format(dataTimestamp.value, 'd MMM yyyy, h bbb'))
</script>
