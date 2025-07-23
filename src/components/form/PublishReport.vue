<template>
  <div class="w-full flex flex-col p-6 space-y-4 md:space-y-6 sm:p-8">
    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
      Upload success!
    </h1>
    <hr class="h-px mb-4 bg-gray-200 border-0 dark:bg-gray-700" />
    <div class="space-y-4 md:space-y-6">
      <p class="text-lg text-gray-500 dark:text-gray-400">
        Preview the document
        <a href="/reports/draft" target="_blank" class="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >here</a
        >
      </p>
      <Button :is-pending="isPending" @click.prevent="handlePublish">Publish</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import Button from '@/components/ui/Button.vue'

  const isPending = ref(false)

  const handlePublish = async () => {
    isPending.value = true

    const res = await fetch('/api/reports/publish', { method: 'POST' })
    const data = await res.json()

    isPending.value = false

    if (data === 'success') location.href = '/reports/published'
  }
</script>
