<template>
  <div>
    At <span class="font-semibold">{{ stationName }}</span
    >, there was <span class="font-semibold">{{ rainStr }}</span> rainfall received at
    <span class="font-semibold">{{ timeStr }}</span
    >. There have been <span class="font-semibold">{{ rain24hStr }}</span> accumulated rainfall for the past 24 hours.
    <!-- This is <span class="font-semibold">{ratio}%</span> of the historical maximum 24hr rainfall for this area which was
    <span class="font-semibold">{rain} mm</span>. -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, computed } from 'vue'
  import { format } from 'date-fns'

  import { getMetValue } from '@/scripts/weather'

  export default defineComponent({
    props: {
      stationName: { type: String, required: true },
      data: { type: Object, required: true },
      timestamp: { type: Date, required: true },
    },
    setup(props) {
      const { data, timestamp } = toRefs(props)

      const rainStr = computed(() => `${getMetValue(data.value.obs, 'rr')} mm`)
      const rain24hStr = computed(() => `${getMetValue(data.value.obs, 'rain24h')} mm`)

      const timeStr = computed(() => format(timestamp.value, 'h bbb'))

      return { rainStr, rain24hStr, timeStr }
    },
  })
</script>
