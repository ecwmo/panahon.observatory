<template>
  <div>
    At <span class="font-semibold">{{ stationName }}</span
    >, the air pressure was
    <span class="font-semibold">{{ presStr }}</span>
    at <span class="font-semibold"> {{ timeStr }}</span
    >.
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
      timestamp: { type: Date, default: new Date() },
    },
    setup(props) {
      const { data, timestamp } = toRefs(props)

      const presStr = computed(() => `${getMetValue(data.value.obs, 'pres')} mb`)

      const timeStr = computed(() => format(timestamp.value, 'h bbb'))

      return { presStr, timeStr }
    },
  })
</script>
