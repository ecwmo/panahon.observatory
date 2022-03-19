<template>
  <div>
    At <span class="font-semibold">{{ data.name }}</span
    >, the temperature at <span class="font-semibold">{{ timeStr }}</span> was
    <span class="font-semibold">{{ tempStr }}</span>
    <span v-show="showHi">
      but feels like <span class="font-semibold">{{ hiStr }}</span> because of the humidity</span
    >. In the past 24 hours, local temperature got up to <span class="font-semibold">{{ txStr }}</span> and got as low
    as <span class="font-semibold">{{ tnStr }}</span
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

      const tempStr = computed(() => `${getMetValue(data.value.obs, 'temp')} °C`)
      const hiStr = computed(() => `${getMetValue(data.value.obs, 'hi')} °C`)
      const txStr = computed(() => `${getMetValue(data.value.obs, 'tx')} °C`)
      const tnStr = computed(() => `${getMetValue(data.value.obs, 'tn')} °C`)

      const showHi = computed(() => `${getMetValue(data.value.obs, 'hi')}` !== '--')

      const timeStr = computed(() => format(timestamp.value, 'h bbb'))

      return { tempStr, hiStr, txStr, tnStr, timeStr, showHi }
    },
  })
</script>
