<template>
  <div ref="rootEl" class="flex flex-col">
    <div class="space-y-2 my-2 md:m-6 md:space-y-6">
      <Lazy v-for="(img, idx) in imgs" :key="img" :style="elStyle" class="flex justify-center">
        <img :src="img" :lazy="idx > 0" class="border border-black shadow-md rounded-2xl" />
      </Lazy>

      <h1
        class="mx-2 md:mx-0 p-1 md:p-3 text-xl md:text-5xl font-bold border-black shadow-md rounded-xl md:rounded-2xl bg-white"
      >
        Additional Information
      </h1>

      <Lazy v-for="img in sImgs" :key="img" :style="elStyle" class="flex justify-center">
        <img :src="img" class="border border-black shadow-md rounded-2xl" />
      </Lazy>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'

  import { report, setViewMode } from '@/stores/report'

  interface Props {
    mode?: string
  }
  const props = withDefaults(defineProps<Props>(), { mode: 'latest' })

  setViewMode(props.mode)

  const $report = useStore(report)

  const { width: wWidth, height: wHeight } = useWindowSize()

  const rootEl = ref()
  const elHeight = ref()
  const elWidth = ref()

  const imgs = computed(() => $report.value?.files ?? [])
  const sImgs = computed(() => $report.value?.staticFiles ?? [])

  const elStyle = computed(() => {
    return wWidth.value > wHeight.value
      ? { height: `${elHeight.value}px` }
      : { height: `${(elWidth.value * 9) / 16}px` }
  })

  onMounted(() => {
    const { width, height } = rootEl.value.parentNode.parentNode?.getClientRects()?.[0]
    elHeight.value = height - 50
    elWidth.value = width
  })
</script>
