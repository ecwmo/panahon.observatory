<template>
  <div class="flex py-4 justify-center">
    <div class="flex flex-col bg-skin-body-fill-inv text-skin-inverted shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div v-if="publishedView">
        <h4 class="p-4 flex justify-center text-3xl font-medium">Publish success!</h4>
        <p class="p-1 mb-3">
          Click
          <router-link to="report" class="underline text-skin-link hover:text-skin-link-active">here</router-link>
        </p>
      </div>
      <div v-else-if="uploadedView">
        <h4 class="p-4 flex justify-center text-3xl font-medium">Upload success!</h4>
        <p class="p-1 mb-3">
          Preview the document
          <router-link
            to="/report?view=draft"
            target="_blank"
            class="underline text-skin-link hover:text-skin-link-active"
            >here</router-link
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
      <div v-else>
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
              <i class="fas fa-cloud-upload-alt fa-2x"></i>
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import axios from 'axios'

  interface Report {
    repcode: string
    reportnum?: number | string
    report?: File
  }

  const route = useRoute()
  const router = useRouter()

  const report = ref({ repcode: '', reportnum: undefined } as Report)

  const publishedView = computed(() => route.query.hasOwnProperty('published'))
  const uploadedView = computed(() => route.query.hasOwnProperty('uploaded'))
  const reportName = computed(() => report.value?.report?.name ?? 'Select a file')

  const handlePublish = async () => {
    const formData = new FormData()

    formData.append('publish', '1')

    const res = await axios.post('/api/report.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (res.data === 'success') router.push('/newreport?published')
  }

  const handleFile = (e: Event) => {
    const el = e.target as HTMLInputElement
    report.value.report = el && el.files ? el.files[0] : ({} as File)
  }

  const handleUpload = async () => {
    const formData = new FormData()

    formData.append('repcode', report.value.repcode)
    formData.append('reportnum', `${report.value.reportnum}`)
    formData.append('report', report.value.report as Blob)
    formData.append('upload', '1')

    const res = await axios.post('/api/report.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (res.data === 'success') router.push('/newreport?uploaded')
  }
</script>
