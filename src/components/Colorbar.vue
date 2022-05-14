<template>
  <div class="absolute flex flex-col justify-center m-1 bottom-0 right-0 bg-white p-2 rounded-md shadow opacity-90">
    <div class="flex justify-center" :class="{ 'mb-2': palette && palette.length > 0 }">
      <div class="text-xs font-semibold justify-center">{{ `${varTitle} (${varUnits})` }}</div>
    </div>
    <div v-show="palette" class="flex">
      <div v-for="(p, idx) in palette" :key="p.color" class="flex flex-col">
        <div
          class="w-8 h-5 border border-black"
          :class="idx > 0 ? 'border-l-0' : ''"
          :style="`background-color:${p.color};`"
        ></div>
        <div v-if="idx !== 0" class="text-xs self-center -ml-8">{{ p.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { toRefs, computed } from 'vue'

  import useWeather from '@/composables/useWeather'

  const props = defineProps({
    name: { type: String, required: true },
  })

  const { name } = toRefs(props)

  const { weatherVariables, getSwatch } = useWeather()

  const varTitle = computed(() => weatherVariables[name.value].name)
  const varUnits = computed(() => weatherVariables[name.value].units)

  const palette = computed(() => getSwatch(name.value))
</script>
