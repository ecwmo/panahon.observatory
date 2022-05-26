<template>
  <div v-if="presStr">
    {{ presStr }}
  </div>
</template>

<script setup lang="ts">
  import { toRefs, computed } from 'vue'

  const props = defineProps({
    data: { type: Object, required: true },
  })

  const { data } = toRefs(props)

  const presStr = computed(() => (data.value?.['pres'] ? `${data.value?.['pres']} hPa` : ''))
</script>
