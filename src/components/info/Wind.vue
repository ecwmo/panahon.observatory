<template>
  <div>
    At <span class="font-semibold">{{ stationName }}</span
    >, the wind at <span class="font-semibold">{{ dateString }}</span> was blowing from
    <span class="font-semibold">{{ wdirStr }}</span> at <span class="font-semibold">{{ wspdStr }}</span
    >.
  </div>
</template>

<script setup lang="ts">
  import { toRefs, computed } from 'vue'

  const props = defineProps({
    stationName: { type: String, required: true },
    data: { type: Object, required: true },
    dateString: { type: String, required: true },
  })

  const { data } = toRefs(props)

  const wspdStr = computed(() => `${data.value['wspd']} m/s`)
  const wdirStr = computed(() => data.value['wdirStr'])
</script>
