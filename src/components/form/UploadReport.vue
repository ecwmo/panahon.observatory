<template>
  <div class="w-full flex flex-col p-6 space-y-4 md:space-y-6 sm:p-8">
    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
      Upload Report
    </h1>
    <hr class="h-px mb-4 bg-gray-200 border-0 dark:bg-gray-700" />
    <form class="space-y-4 md:space-y-6" @submit.prevent="handleUpload">
      <FormInput name="title" :placeholder="reportTitlePlaceholder" v-model="report.title">Title</FormInput>
      <div class="flex space-x-4">
        <FormInput name="code" placeholder="wp<CY><YYYY>" v-model="report.code" class="w-3/4" required>Code</FormInput>
        <FormInput type="number" name="number" placeholder="1" v-model.number="report.number" required
          >Number</FormInput
        >
      </div>
      <div>
        <span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">File</span>
        <label
          for="filename"
          class="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <div v-if="!report.file" class="i-fa6-solid-paperclip text-5xl" />

            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <template v-if="!report.file">
                <span class="font-semibold">Click to upload</span> or drag and drop
              </template>
              <span v-else>{{ reportName }}</span>
            </p>
          </div>
          <input id="filename" type="file" name="filename" class="hidden" required @change="handleFile" />
        </label>
      </div>

      <div v-if="prog" class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
          :style="{ width: `${prog}%` }"
        >
          {{ `${prog}%` }}
        </div>
      </div>
      <Button :disabled="!isValid" :is-pending="isPending">Upload</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive } from 'vue'

  import FormInput from '@/components/ui/Input.vue'
  import Button from '@/components/ui/Button.vue'

  interface Report {
    title: string
    code: string
    number?: number
    file?: File
  }

  const report = reactive<Report>({ code: '', title: '' })

  const isPending = ref(false)
  const isValid = computed(() => !(!report.code || !report.number || !report.file))

  const prog = ref(0)

  const reportName = computed(() => report.file?.name ?? 'Select a file')
  const reportTitlePlaceholder = computed(() => {
    if (report.code.length === 0) {
      return ''
    }
    const reportCode = report.code.trim().toUpperCase()
    const reportNum = report.number ? '#' + `${report.number}`.padStart(3, '0') : ''
    return `${reportCode} ${reportNum}`
  })

  const handleFile = (e: Event) => {
    const el = e.target as HTMLInputElement
    report.file = el && el.files ? el.files[0] : ({} as File)
  }

  const handleUpload = async () => {
    isPending.value = true
    const formData = new FormData()

    formData.append('title', report.title ?? reportTitlePlaceholder.value)
    formData.append('code', report.code)
    formData.append('number', `${report.number}`)
    if (report.file) formData.append('report', report.file)

    const res = await fetch('/api/reports/upload', { method: 'POST', body: formData })
    const data = await res.json()

    const events = new EventSource('/api/reports/upload?id=' + data.jobId)

    events.onmessage = (e) => {
      const update = JSON.parse(e.data)
      switch (update.event) {
        case 'progress':
          if (update.status === 'converted') {
            prog.value = Math.trunc((100 * update.page) / update.total)
          }
          break
        case 'done':
          events.close()
          isPending.value = false
          location.href = '/reports/publish'
          break
        case 'error':
          events.close()
          isPending.value = false
          console.error(update.error)
        default:
          events.close()
          isPending.value = false
      }
    }
  }
</script>
