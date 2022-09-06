<template>
  <div v-if="stationName">
    At <span class="font-semibold">{{ stationName }}</span
    >, the air pressure was
    <span class="font-semibold">{{ presStr }}</span>
    at <span class="font-semibold"> {{ dateString }}</span
    >.
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    stationName: { type: String, default: '' },
    data: { type: Object, required: true },
    dateString: { type: String, required: true },
  })

  const { data } = toRefs(props)

  const presStr = computed(() => `${data.value?.['pres']} mb`)
</script>
