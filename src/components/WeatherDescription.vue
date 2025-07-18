<template>
  <div v-if="stationName"> <!-- Creates the additional info found in the Cards -->
    <template v-if="id === 'temp'">
      At <span class="font-semibold">{{ stationName }}</span
      >, the temperature at <span class="font-semibold">{{ dateString }}</span> was
      <span class="font-semibold">{{ tempStr }}</span>
      <span v-show="showHi">
        but feels like <span class="font-semibold">{{ hiStr }}</span> because of the humidity</span
      >. In the past 24 hours, local temperature got up to <span class="font-semibold">{{ txStr }}</span> and got as low
      as <span class="font-semibold">{{ tnStr }}</span
      >.
    </template>
    <template v-else-if="id === 'wind'">
      At <span class="font-semibold">{{ stationName }}</span
      >, the wind at <span class="font-semibold">{{ dateString }}</span> was blowing from
      <span class="font-semibold">{{ wdirStr }}</span> at <span class="font-semibold">{{ wspdStr }}</span
      >.
    </template>
    <template v-else-if="id === 'pres'">
      At <span class="font-semibold">{{ stationName }}</span
      >, the air pressure was
      <span class="font-semibold">{{ presStr }}</span>
      at <span class="font-semibold"> {{ dateString }}</span
      >.
    </template>
    <template v-else>
      At <span class="font-semibold">{{ stationName }}</span
      >, there was <span class="font-semibold">{{ rainStr }}</span> rainfall received at
      <span class="font-semibold">{{ dateString }}</span
      >. There have been <span class="font-semibold">{{ rainAccum }}</span> accumulated rainfall for the past 24 hours.
      <!-- This is <span class="font-semibold">{ratio}%</span> of the historical maximum 24hr rainfall for this area which was
    <span class="font-semibold">{rain} mm</span>. -->
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, toRefs } from 'vue'

  import type { ObservationKeys } from '@/types/station'
  type ObservationStr = {
    [K in ObservationKeys | 'wdirStr']: string
  }
  const props = withDefaults(
    defineProps<{
      id: string
      stationName?: string
      data: ObservationStr
      dateString?: string
    }>(),
    { stationName: '' }
  )

  const { data } = toRefs(props)

  const rainStr = computed(() => `${data.value?.rain} mm`)
  const rainAccum = computed(() => `${data.value?.rainAccum} mm`)

  const tempStr = computed(() => `${data.value?.temp} °C`)
  const hiStr = computed(() => `${data.value?.hi} °C`)
  const txStr = computed(() => `${data.value?.tx} °C`)
  const tnStr = computed(() => `${data.value?.tn} °C`)

  const showHi = computed(() => `${data.value?.hi}` !== '--')

  const wspdStr = computed(() => `${data.value?.wspd} m/s`)
  const wdirStr = computed(() => data.value?.wdirStr)

  const presStr = computed(() => `${data.value?.mslp} mb`)
</script>
