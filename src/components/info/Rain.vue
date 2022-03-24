<template>
  <div>
    At <span class="font-semibold">{{ stationName }}</span
    >, there was <span class="font-semibold">{{ rainStr }}</span> rainfall received at
    <span class="font-semibold">{{ dateString }}</span
    >. There have been <span class="font-semibold">{{ rain24hStr }}</span> accumulated rainfall for the past 24 hours.
    <!-- This is <span class="font-semibold">{ratio}%</span> of the historical maximum 24hr rainfall for this area which was
    <span class="font-semibold">{rain} mm</span>. -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, computed } from 'vue'

  export default defineComponent({
    props: {
      stationName: { type: String, required: true },
      data: { type: Object, required: true },
      dateString: { type: String, required: true },
    },
    setup(props) {
      const { data } = toRefs(props)

      const rainStr = computed(() => `${data.value['rr']} mm`)
      const rain24hStr = computed(() => `${data.value['rain24h']} mm`)

      return { rainStr, rain24hStr }
    },
  })
</script>
