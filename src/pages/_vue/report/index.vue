<template>
  <div class="flex flex-col">
    <div class="m-6 space-y-6">
      <Image
        v-for="(img, idx) in imgs"
        :key="img"
        :src="img"
        :lazy="idx > 0"
        class="border border-black shadow-md rounded-2xl"
      />
    </div>

    <div v-if="sImgs.length > 0" class="mx-6 border border-black shadow-md rounded-2xl bg-white">
      <h1 class="p-3 text-5xl font-bold">Additional Information</h1>
    </div>

    <div class="m-6 space-y-6">
      <Image v-for="img in sImgs" :key="img" :src="img" class="border border-black shadow-md rounded-2xl" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'

  import { reports, setViewMode } from '@/stores/report'

  interface Props {
    mode?: string
  }
  const props = withDefaults(defineProps<Props>(), { mode: '' })

  setViewMode(props.mode)

  const repStore = useStore(reports)

  const imgs = computed(() => repStore.value?.data?.reportImgs ?? [])
  const sImgs = computed(() => repStore.value?.data?.staticImgs ?? [])
</script>
