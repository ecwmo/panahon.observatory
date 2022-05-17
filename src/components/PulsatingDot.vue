<template>
  <div v-if="'x' in xy" class="absolute" :style="`top: ${xy.y - rMax}px; left: ${xy.x - rMax}px`">
    <svg :width="vSize" :height="vSize" :viewbox="`0 0 ${vSize} ${vSize}`" xmlns="http://www.w3.org/rMax00/svg">
      <circle :cx="rMax" :cy="rMax" fill="none" :r="size" :stroke="color" stroke-width="2">
        <animate attributeName="r" :from="rMin" :to="rMax" dur="1.6s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0.5" dur="1.6s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="stroke-width" from="2" to="4" dur="1.6s" begin="0s" repeatCount="indefinite" />
      </circle>
      <!-- <circle :cx="rMax" :cy="rMax" :fill="color" :r="size" /> -->
    </svg>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { PropType, computed, toRefs } from 'vue'
  import type { Point } from 'mapbox-gl'
  const props = defineProps({
    size: { type: Number, default: 5 },
    xy: { type: Object as PropType<Point>, required: true },
    color: { type: String, default: '#383a36' },
  })

  const { size } = toRefs(props)

  const rMin = computed(() => size.value * 0.8)
  const rMax = computed(() => size.value * 2)
  const vSize = computed(() => rMax.value * 4)
</script>
