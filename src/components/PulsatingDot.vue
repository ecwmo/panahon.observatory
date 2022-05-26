<template>
  <div v-if="'x' in xy" class="absolute" :style="vStyle">
    <svg :width="vSize" :height="vSize" :viewbox="vBox" xmlns="http://www.w3.org/2000/svg">
      <circle :cx="cx" :cy="cy" fill="none" :r="size" :stroke="color" :stroke-width="strokeWidth">
        <animate attributeName="r" :from="rMin" :to="rMax" dur="1.6s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0.5" dur="1.6s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="stroke-width" from="2" to="4" dur="1.6s" begin="0s" repeatCount="indefinite" />
      </circle>
      <circle :cx="cx" :cy="cy" :fill="fillColor" :r="size" />
    </svg>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from 'vue'
  import type { Point } from 'mapbox-gl'

  const props = defineProps({
    size: { type: Number, default: 5 },
    xy: { type: Object as PropType<Point>, required: true },
    color: { type: String, default: '#383a36' },
    fillColor: { type: String, default: 'none' },
  })

  const { size, xy } = toRefs(props)
  const strokeWidth = 2

  const rMin = computed(() => size.value * 0.8)
  const rMax = computed(() => size.value * 2)
  const vSize = computed(() => (rMax.value + strokeWidth) * 2)
  const vBox = computed(() => `0 0 ${vSize.value} ${vSize.value}`)
  const cx = computed(() => vSize.value / 2)
  const cy = computed(() => cx.value)
  const vStyle = computed(() => `top: ${xy.value.y - cy.value}px; left: ${xy.value.x - cx.value}px`)
</script>
