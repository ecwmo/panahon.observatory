<template>
  <a :href="`/reports/${data.id}`" class="group">
    <img
      :src="`${resourcePath}/reports/${data.coverImg}`"
      alt="image"
      class="max-w-full h-full object-cover ease-in-out duration-500 group-hover:scale-110"
      @load="$emit('load', $event)"
    />
    <div class="absolute bg-black w-full h-full opacity-10 transition-opacity duration-500 group-hover:opacity-50" />
    <p class="absolute bottom-0 p-2 w-full text-gray-700 text-sm rounded-b-lg backdrop-blur-lg backdrop-opacity-75">
      {{ data.title }}
    </p>
  </a>
</template>

<script lang="ts" setup>
  import type { Report } from '@/types/report'

  import { resourcePath } from '@/lib/helper/pages'

  defineProps<{
    data: Report
  }>()

  const emit = defineEmits<{
    (e: 'load', ev: Event): void
  }>()
</script>
