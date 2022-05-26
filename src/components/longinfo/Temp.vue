<template>
  <div v-if="stationName">
    At <span class="font-semibold">{{ stationName }}</span
    >, the temperature at <span class="font-semibold">{{ dateString }}</span> was
    <span class="font-semibold">{{ tempStr }}</span>
    <span v-show="showHi">
      but feels like <span class="font-semibold">{{ hiStr }}</span> because of the humidity</span
    >. In the past 24 hours, local temperature got up to <span class="font-semibold">{{ txStr }}</span> and got as low
    as <span class="font-semibold">{{ tnStr }}</span
    >.
  </div>
</template>

<script setup lang="ts">
  import { toRefs, computed } from 'vue'

  const props = defineProps({
    stationName: { type: String },
    data: { type: Object, required: true },
    dateString: { type: String, required: true },
  })

  const { data } = toRefs(props)

  const tempStr = computed(() => `${data.value?.['temp']} °C`)
  const hiStr = computed(() => `${data.value?.['hi']} °C`)
  const txStr = computed(() => `${data.value?.['tx']} °C`)
  const tnStr = computed(() => `${data.value?.['tn']} °C`)

  const showHi = computed(() => `${data.value?.['hi']}` !== '--')
</script>
