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

  const buttons = ref([
    {
      id: 'rain',
      label: 'RAIN (mm)',
      icon: 'i-fa6-solid-cloud-rain',
      defaultClass: 'text-stone-600 hover:text-blue-600',
      activeClass: 'text-blue-600',
    },
    {
      id: 'temp',
      label: 'TEMPERATURE (°C)',
      icon: 'i-fa-solid-thermometer-half',
      defaultClass: 'text-stone-600 hover:text-red-600',
      activeClass: 'text-red-600',
    },
    {
      id: 'wind',
      label: 'WIND (m/s)',
      icon: 'i-fa6-solid-wind',
      defaultClass: 'text-stone-600 hover:text-cyan-600',
      activeClass: 'text-cyan-600',
    },
    {
      id: 'pres',
      label: 'PRESSURE (hPa)',
      icon: 'i-wi-barometer',
      defaultClass: 'text-stone-600 hover:text-amber-600',
      activeClass: 'text-amber-600',
    },
  ])
</script>
