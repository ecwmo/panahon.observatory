<template>
  <div>
    At <span class="font-semibold">{{ stationName }}</span
    >, the air pressure was
    <span class="font-semibold">{{ presStr }}</span>
    at <span class="font-semibold"> {{ dateString }}</span
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

  const presStr = computed(() => `${data.value['pres']} mb`)
</script>
