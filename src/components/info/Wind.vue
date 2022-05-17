<template>
  <div class="flex flex-col">
    <div>
      {{ wspdStr }}
    </div>
    <div class="text-[0.6rem]">
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

  const wspdStr = computed(() => `${data.value['wspd']} m/s`)
  const wdirStr = computed(() => data.value['wdirStr'])
</script>
