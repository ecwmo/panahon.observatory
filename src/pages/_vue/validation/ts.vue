<template>
  <div class="flex flex-col h-full w-full items-center justify-center space-y-2 md:space-y-4">
    <ValidationDateSelector :range-view="true" class="w-48 z-30" />

    <div class="flex flex-col md:flex-row h-full w-full space-x-2 md:space-x-4">
      <MapBox :token="mapboxToken" class="w-full md:w-1/2 h-full z-0" />

      <div class="w-full md:w-1/2 h-full">
        <img class="object-contain rounded-2xl" :src="activeStnImg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { computed, watch } from 'vue'

  import { useActiveValidationStation } from '@/composables/activeValidationStation'
  import { $activeStation, setActiveStation, setViewType } from '@/stores/station'

  import MapBox from '@/components/MapBox.vue'
  import ValidationDateSelector from '@/components/ValidationDateSelector.vue'

  defineProps<{
    mapboxToken: string
  }>()

  setViewType('validation')

  const activeStation = useStore($activeStation)

  const { data: station, isSuccess } = useActiveValidationStation()
  watch(isSuccess, () => {
    if (isSuccess.value && station.value) setActiveStation(station.value)
  })

  const activeStnImg = computed(() =>
    activeStation.value && 'tsImg' in activeStation.value ? activeStation.value?.tsImg : '',
  )
</script>
