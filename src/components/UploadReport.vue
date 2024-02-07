<template>
  <div>
    <h1 class="block mb-2 text-3xl font-medium text-gray-900 dark:text-white">Report Upload</h1>
    <hr class="h-px mb-4 bg-gray-200 border-0 dark:bg-gray-700" />
    <form @submit.prevent="handleUpload">
      <div class="mb-4">
        <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
        <input
          id="title"
          v-model="report.title"
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          name="title"
          :placeholder="reportTitlePlaceholder"
        />
      </div>

      <div class="mb-4">
        <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code</label>
        <input
          id="code"
          v-model="report.code"
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          name="code"
          placeholder="wp<CY><YYYY>"
          required
        />
      </div>

      <div class="mb-4">
        <label for="number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number</label>
        <input
          id="number"
          v-model.number="report.number"
          type="number"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          name="number"
          placeholder="1"
          required
        />
      </div>

      <div class="mb-4">
        <span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">File</span>
        <label
          for="filename"
          class="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              v-if="report.file === undefined"
              aria-hidden="true"
              class="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>

            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <template v-if="report.file === undefined">
                <span class="font-semibold">Click to upload</span> or drag and drop
              </template>
              <span v-else>{{ reportName }}</span>
            </p>
          </div>
          <input id="filename" type="file" name="filename" class="hidden" required @change="handleFile" />
        </label>
      </div>

      <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Upload
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { _apiRoute, route } from '@/stores/routes'
  import { ref } from 'vue'

  interface Report {
    title: string
    code: string
    number?: number
    file?: File
  }

  const report = ref<Report>({ code: '', title: '' })

  const reportName = computed(() => report.value?.file?.name ?? 'Select a file')
  const reportTitlePlaceholder = computed(() => {
    if (report.value.code.length === 0) {
      return ''
    }
    const reportCode = report.value.code.trim().toUpperCase()
    const reportNum = report.value.number ? '#' + `${report.value.number}`.padStart(3, '0') : ''
    return `${reportCode} ${reportNum}`
  })

  const handleFile = (e: Event) => {
    const el = e.target as HTMLInputElement
    report.value.file = el && el.files ? el.files[0] : ({} as File)
  }

  const handleUpload = async () => {
    const formData = new FormData()

    formData.append('title', report.value.title ?? reportTitlePlaceholder.value)
    formData.append('code', report.value.code)
    formData.append('number', `${report.value.number}`)
    if (report.value.file) formData.append('report', report.value.file)
    formData.append('upload', '1')

    const res = await fetch(_apiRoute('reports'), { method: 'POST', body: formData })
    const data = await res.json()
    if (data === 'success') location.href = route('reports/publish')
  }
</script>
