<template>
  <div>
    At <span class="font-semibold">{{ stationName }}</span
    >, the wind at <span class="font-semibold">{{ dateString }}</span> was blowing from
    <span class="font-semibold">{{ wdirStr }}</span> at <span class="font-semibold">{{ wspdStr }}</span
    >.
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

      const wspdStr = computed(() => `${data.value['wspd']} m/s`)
      const wdirStr = computed(() => data.value['wdirStr'])

      return { wspdStr, wdirStr }
    },
  })
</script>
