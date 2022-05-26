<template>
  <div v-if="rain24hStr" class="flex flex-col">
    <div>
      {{ rain24hStr }}
    </div>
    <div class="text-[0.6rem]">(24hr)</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    data: { type: Object, required: true },
  })

  const { data } = toRefs(props)

  const rain24hStr = computed(() => (data.value?.['rain24h'] ? `${data.value?.['rain24h']} mm` : ''))
</script>
