<template>
  <a :href="route(`reports/${data.id}`)" class="group">
    <img
      :src="`${resourcePath}/reports/${data.coverImg}`"
      alt="image"
      class="max-w-full h-full object-cover ease-in-out duration-500 group-hover:scale-110"
      @load="$emit('load')"
    />
    <div class="absolute bg-black w-full h-full opacity-10 transition-opacity duration-500 group-hover:opacity-50" />
    <p class="absolute bottom-0 p-2 w-full text-gray-700 text-sm rounded-b-lg backdrop-blur-lg backdrop-opacity-75">
      {{ data.title }}
    </p>
  </a>
</template>

<script lang="ts" setup>
  import type { Report } from '@/types/report'

  import { resourcePath } from '@/pages/_common'
  import { route } from '@/stores/routes'

  interface Props {
    data: Report
  }
  defineProps<Props>()

  interface Emits {
    (e: 'load'): void
  }
  defineEmits<Emits>()
</script>
