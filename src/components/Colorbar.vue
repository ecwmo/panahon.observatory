<template>
  <div
    v-show="palette"
    class="absolute flex flex-col justify-center m-1 bottom-0 right-0 bg-white p-2 rounded-md shadow opacity-90"
  >
    <div class="flex justify-center mb-2">
      <div class="text-xs font-semibold justify-center" x-text="`${varName} (${varUnit})`"></div>
    </div>
    <div class="flex">
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

  import { metVars } from '@/scripts/weather'
  import { getSwatch } from '@/scripts/color'

  const props = defineProps({
    name: { type: String, required: true },
  })

  const { name } = toRefs(props)

  const palette = computed(() => {
    if (Object.keys(metVars).indexOf(name.value) !== -1) {
      const { min, max } = metVars[name.value].range
      return getSwatch(name.value, min, max)
    } else return null
  })
</script>
