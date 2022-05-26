<template>
  <div v-if="wspdStr" class="flex flex-col">
    <div>
      {{ wspdStr }}
    </div>
    <div v-if="wdirStr" class="text-[0.6rem]">
      {{ `(${wdirStr})` }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { toRefs, computed } from 'vue'

  const props = defineProps({
    data: { type: Object, required: true },
  })

  const { data } = toRefs(props)

  const wspdStr = computed(() => (data.value?.['wspd'] ? `${data.value?.['wspd']} m/s` : ''))
  const wdirStr = computed(() => data.value?.['wdirStr'])
</script>
