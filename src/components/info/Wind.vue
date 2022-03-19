<template>
  <div>
    At <span class="font-semibold">{{ data.name }}</span
    >, the wind at <span class="font-semibold">{{ timeStr }}</span> was blowing from
    <span class="font-semibold">{{ wdirStr }}</span> at <span class="font-semibold">{{ wspdStr }}</span
    >.
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, computed } from 'vue'
  import { format } from 'date-fns'

  import { getMetValue } from '@/scripts/weather'

  export default defineComponent({
    props: { data: { type: Object, required: true }, timestamp: { type: Date, default: new Date() } },
    setup(props) {
      const { data, timestamp } = toRefs(props)

      const wspdStr = computed(() => `${getMetValue(data.value.obs, 'wspd')} m/s`)
      const wdirStr = computed(() => getMetValue(data.value.obs, 'wdirStr'))

      const timeStr = computed(() => format(timestamp.value, 'h bbb'))

      return { wspdStr, wdirStr, timeStr }
    },
  })
</script>
