<template>
  <div class="bg-gray-300 border-l border-r border-b border-black flex py-4 justify-center">
    <div class="flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div v-if="publishedView">
        <h4 class="p-4 flex justify-center text-3xl font-medium">Publish success!</h4>
        <p class="p-1 mb-3">
          Click
          <router-link to="report" class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >here</router-link
          >
        </p>
      </div>
      <div v-else-if="uploadedView">
        <h4 class="p-4 flex justify-center text-3xl font-medium">Upload success!</h4>
        <p class="p-1 mb-3">
          Preview the document
          <router-link
            to="/report?view=draft"
            target="_blank"
            class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >here</router-link
          >
        </p>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            name="publish"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            @click.prevent="handlePublish"
          >
            Publish
          </button>
        </div>
      </div>
      <div v-else>
        <h1 class="p-4 flex justify-center text-3xl font-medium">Report Upload</h1>
        <form @submit.prevent="handleUpload">
          <div class="mb-4">
            <label for="tccode" class="block text-gray-700 text-sm font-bold mb-2">TC Code</label>
            <input
              v-model="report.tccode"
              type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tccode"
              name="tccode"
              placeholder="wp<CY><YYYY>"
              required
            />
          </div>

          <div class="mb-4">
            <label for="reportnum" class="block text-gray-700 text-sm font-bold mb-2">Report Number</label>
            <input
              v-model="report.reportnum"
              type="number"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="reportnum"
              name="reportnum"
              placeholder="1"
              required
            />
          </div>

          <div class="mb-4">
            <span>Attachments</span>
            <label
              class="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-500 appearance-none border rounded-lg shadow tracking-wide uppercase cursor-pointer hover:bg-blue-500 hover:text-white"
            >
              <i class="fas fa-cloud-upload-alt fa-2x"></i>
              <span class="mt-2 text-base truncate">{{
                report.report ? report.report.name.replace(/^.*[\\\/]/, '') : 'Select a file'
              }}</span>
              <input type="file" name="filename" class="hidden" @change="handleFile" required />
            </label>
          </div>

          <div class="flex items-center justify-between">
            <button
              type="submit"
              name="upload"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'

  import useAuth from '@/composables/useAuth'

  interface ReportData {
    [key: string]: any
    tccode: string
    reportnum: number
    report: any
  }

  export default defineComponent({
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        //@ts-ignore
        if (!vm.isLoggedIn) {
          vm.$router.push('/login')
        }
      })
    },
    setup() {
      const route = useRoute()
      const router = useRouter()

      const { isLoggedIn } = useAuth()

      const report = ref(<ReportData>{})

      const publishedView = computed(() => route.query.hasOwnProperty('published'))
      const uploadedView = computed(() => route.query.hasOwnProperty('uploaded'))

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
        const el = <HTMLInputElement>e.target
        report.value.report = el && el.files ? el.files[0] : {}
      }

      const handleUpload = async () => {
        const formData = new FormData()

        Object.keys(report.value).forEach((k) => {
          formData.append(k, report.value[k])
        })
        formData.append('upload', '1')

        const res = await axios.post('/api/report.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (res.data === 'success') router.push('/newreport?uploaded')
      }

      return { isLoggedIn, report, handleFile, publishedView, uploadedView, handleUpload, handlePublish }
    },
  })
</script>
