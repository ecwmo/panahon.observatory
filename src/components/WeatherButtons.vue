<template>
  <div class="absolute flex flex-col items-center space-y-2.5 rounded-full">
    <div
      v-for="btn in buttons"
      :key="btn.id"
      class="cursor-pointer"
      :class="[btn.id === modelValue ? btn.activeClass : btn.defaultClass]"
      @click.prevent="$emit('update:modelValue', btn.id)"
    >
      <i :class="`${btn.iconClass} text-2xl`"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{ modelValue: string }>()
  defineEmits(['update:modelValue'])

  const buttons = ref([
    {
      id: 'rain',
      label: 'RAIN (mm)',
      iconClass: 'fas fa-cloud-rain',
      defaultClass: 'text-stone-600 hover:text-blue-600',
      activeClass: 'text-blue-600',
    },
    {
      id: 'temp',
      label: 'TEMPERATURE (°C)',
      iconClass: 'fas fa-thermometer-half',
      defaultClass: 'text-stone-600 hover:text-red-600',
      activeClass: 'text-red-600',
    },
    {
      id: 'wind',
      label: 'WIND (m/s)',
      iconClass: 'fas fa-wind',
      defaultClass: 'text-stone-600 hover:text-cyan-600',
      activeClass: 'text-cyan-600',
    },
    {
      id: 'pres',
      label: 'PRESSURE (hPa)',
      iconClass: 'wi wi-barometer',
      defaultClass: 'text-stone-600 hover:text-amber-600',
      activeClass: 'text-amber-600',
    },
  ])
</script>
