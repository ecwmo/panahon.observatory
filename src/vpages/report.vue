<template>
  <div class="flex flex-col">
    <div class="m-6 space-y-6">
      <Image v-for="(img, idx) in reportStore?.data?.reportImgs" :key="idx" :src="img" :lazy="idx > 0" />
    </div>
    <div v-show="showStaticImgs" class="mx-6 border border-black shadow-md rounded-2xl bg-white">
      <h1 class="p-3 text-5xl font-bold">Additional Information</h1>
    </div>
    <div class="m-6 space-y-6">
      <Image v-for="(img, idx) in reportStore?.data?.staticImgs" :key="idx" :src="img" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reports, setViewMode } from '@/stores/report'
  import { useStore } from '@nanostores/vue'

  interface Props {
    viewMode: string
  }
  const props = withDefaults(defineProps<Props>(), { viewMode: '' })

  setViewMode(props.viewMode)

  const reportStore = useStore(reports)

  const showStaticImgs = computed(
    () => reportStore.value.data?.staticImgs && reportStore.value.data?.staticImgs.length > 0
  )
</script>
