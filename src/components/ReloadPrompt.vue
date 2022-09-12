<script setup lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/vue'

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

  const close = async () => {
    offlineReady.value = false
    needRefresh.value = false
  }
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="fixed right-0 bottom-0 m-5 p-4 bg-skin-body-fill-inv text-skin-inverted rounded-md border border-black z-10"
    role="alert"
  >
    <div class="mb-4">
      <span v-if="offlineReady"> App ready to work offline </span>
      <span v-else> New content available, click on reload button to update. </span>
    </div>
    <div class="flex gap-2">
      <button
        v-if="needRefresh"
        class="w-16 bg-skin-button hover:bg-skin-button-accent text-skin-button hover:text-skin-button-accent px-1.5 py-1 rounded-lg border shadow-md"
        @click="updateServiceWorker()"
      >
        Reload
      </button>
      <button
        class="w-16 bg-skin-button-accent hover:bg-skin-button text-skin-button-accent hover:text-skin-button px-1.5 py-1 rounded-lg border shadow-md"
        @click="close"
      >
        Close
      </button>
    </div>
  </div>
</template>
