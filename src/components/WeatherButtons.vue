<template>
  <div class="absolute flex flex-col items-center space-y-2.5 rounded-full">
    <div
      v-for="btn in buttons"
      :key="btn.id"
      class="cursor-pointer"
      :class="[btn.id === activeVariable ? btn.activeClass : btn.defaultClass]"
      @click.prevent="setActiveVariable(btn.id)"
    >
      <div class="text-xl" :class="btn.icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { ref } from 'vue'

  import { $activeVariable, setActiveVariable } from '@/stores/station'

  const activeVariable = useStore($activeVariable)

  const buttons = ref([ //constructs the button at the bottom right of the map
    {
      id: 'rain',
      label: 'RAIN (mm)',
      icon: 'i-fa6-solid-cloud-rain',
      defaultClass: 'text-widgets-Default hover:text-widgets-Rain',
      activeClass: 'text-widgets-Rain',
    },
    {
      id: 'temp',
      label: 'TEMPERATURE (°C)',
      icon: 'i-fa-solid-thermometer-half',
      defaultClass: 'text-widgets-Default hover:text-widgets-Temp',
      activeClass: 'text-widgets-Temp',
    },
    {
      id: 'wind',
      label: 'WIND (m/s)',
      icon: 'i-fa6-solid-wind',
      defaultClass: 'text-widgets-Default hover:text-widgets-Wind',
      activeClass: 'text-widgets-Wind',
    },
    {
      id: 'pres',
      label: 'PRESSURE (hPa)',
      icon: 'i-wi-barometer',
      defaultClass: 'text-widgets-Default hover:text-widgets-Pres',
      activeClass: 'text-widgets-Pres',
    },
  ])
</script>
