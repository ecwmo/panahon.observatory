<template>
  <div>
    <h4 class="p-4 flex justify-center text-3xl font-medium">Upload success!</h4>
    <p class="p-1 mb-3">
      Preview the document
      <a :href="route('reports/draft')" target="_blank" class="underline text-blue-600 hover:text-blue-400">here</a>
    </p>
    <div class="flex items-center justify-between">
      <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click.prevent="handlePublish"
      >
        Publish
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { _apiRoute, route } from '@/stores/routes'

  const handlePublish = async () => {
    const formData = new FormData()

    formData.append('publish', '1')

    const res = await fetch(_apiRoute('reports'), { method: 'POST', body: formData })
    const data = await res.json()

    if (data === 'success') location.href = route('reports/published')
  }
</script>
