<template>
  <div>
    <h1 class="p-4 flex justify-center text-3xl font-medium">Report Upload</h1>
    <form @submit.prevent="handleUpload">
      <div class="mb-4">
        <label for="repcode" class="block text-sm font-bold mb-2">Report Code</label>
        <input
          id="repcode"
          v-model="report.repcode"
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          name="repcode"
          placeholder="wp<CY><YYYY>"
          required
        />
      </div>

      <div class="mb-4">
        <label for="reportnum" class="block text-sm font-bold mb-2">Report Number</label>
        <input
          id="reportnum"
          v-model="report.reportnum"
          type="number"
          class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          name="reportnum"
          placeholder="1"
          required
        />
      </div>

      <div class="mb-4">
        <span>Attachments</span>
        <label
          class="w-64 flex flex-col items-center px-4 py-6 bg-white text-skin-button-active appearance-none border rounded-lg shadow tracking-wide uppercase cursor-pointer hover:bg-skin-button hover:text-skin-button"
        >
          <i-fa-solid-cloud-upload-alt class="text-5xl" />
          <span class="mt-2 text-base truncate">{{ reportName }}</span>
          <input type="file" name="filename" class="hidden" required @change="handleFile" />
        </label>
      </div>

      <div class="flex items-center justify-between">
        <Button type="submit" class="uppercase font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >Upload</Button
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { apiRoute, route } from '@/stores/routes'

  interface Report {
    repcode: string
    reportnum?: number | string
    report?: File
  }

  const report = ref({ repcode: '', reportnum: undefined } as Report)

  const reportName = computed(() => report.value?.report?.name ?? 'Select a file')

  const handleFile = (e: Event) => {
    const el = e.target as HTMLInputElement
    report.value.report = el && el.files ? el.files[0] : ({} as File)
  }

  const handleUpload = async () => {
    const formData = new FormData()

    formData.append('repcode', report.value.repcode)
    formData.append('reportnum', `${report.value.reportnum}`)
    formData.append('report', report.value.report)
    formData.append('upload', '1')

    const res = await fetch(apiRoute('report'), { method: 'POST', body: formData })
    const data = await res.json()
    if (data === 'success') location.href = route('report/publish')
  }
</script>
