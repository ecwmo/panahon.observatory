<template>
  <div class="absolute flex flex-col items-center space-y-2.5 rounded-full">
    <div
      v-for="btn in buttons"
      :key="btn.id"
      class="cursor-pointer"
      :class="[btn.id === modelValue ? btn.activeClass : btn.defaultClass]"
      @click.prevent="$emit('update:modelValue', btn.id)"
    >
      <i-fa6-solid-cloud-rain v-if="btn.iconName === 'fa6s-cloud-rain'" class="text-xl" />
      <i-fa-solid-thermometer-half v-else-if="btn.iconName === 'fas-thermometer-half'" class="text-xl" />
      <i-fa6-solid-wind v-else-if="btn.iconName === 'fa6s-wind'" class="text-xl" />
      <i-wi-barometer v-else-if="btn.iconName === 'wi-barometer'" class="text-xl scale-150" />
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
      iconName: 'fa6s-cloud-rain',
      defaultClass: 'text-stone-600 hover:text-blue-600',
      activeClass: 'text-blue-600',
    },
    {
      id: 'temp',
      label: 'TEMPERATURE (°C)',
      iconName: 'fas-thermometer-half',
      defaultClass: 'text-stone-600 hover:text-red-600',
      activeClass: 'text-red-600',
    },
    {
      id: 'wind',
      label: 'WIND (m/s)',
      iconName: 'fa6s-wind',
      defaultClass: 'text-stone-600 hover:text-cyan-600',
      activeClass: 'text-cyan-600',
    },
    {
      id: 'pres',
      label: 'PRESSURE (hPa)',
      iconName: 'wi-barometer',
      defaultClass: 'text-stone-600 hover:text-amber-600',
      activeClass: 'text-amber-600',
    },
  ])
</script>
