<template>
  <div>
    <h4 class="p-4 flex justify-center text-3xl font-medium">Upload success!</h4>
    <p class="p-1 mb-3">
      Preview the document
      <a :href="route('report?view=draft')" target="_blank" class="underline text-skin-link hover:text-skin-link-active"
        >here</a
      >
    </p>
    <div class="flex items-center justify-between">
      <Button
        type="submit"
        class="uppercase font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        @click.prevent="handlePublish"
        >Publish</Button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { apiRoute, route } from '@/stores/routes'

  const handlePublish = async () => {
    const formData = new FormData()

    formData.append('publish', '1')

    const res = await fetch(apiRoute('report'), { method: 'POST', body: formData })
    const data = await res.json()

    if (data === 'success') location.href = route('report/published')
  }
</script>
