<template>
  <div ref="bodyEl" class="h-full overflow-y-scroll">
    <div class="flex flex-col gap-y-2 md:gap-y-4">
      <div class="flex justify-center">
        <img :src="imgs[0]" class="border border-black shadow-md rounded-2xl" @load="handleImgLoad" />
      </div>

      <Lazy
        v-for="img in imgs.slice(1)"
        :key="img"
        :class="[showLazyItems ? 'flex justify-center' : 'h-screen']"
        :style="elStyle"
      >
        <img :src="img" class="border border-black shadow-md rounded-2xl" />
      </Lazy>

      <h1
        v-if="sImgs.length > 0"
        class="mx-2 md:mx-0 p-1 md:p-3 text-xl md:text-5xl font-bold border-black shadow-md rounded-xl md:rounded-2xl bg-white"
      >
        Additional Information
      </h1>

      <Lazy
        v-for="img in sImgs"
        :key="img"
        :class="[showLazyItems ? 'flex justify-center' : 'h-screen']"
        :style="elStyle"
      >
        <img :src="img" class="border border-black shadow-md rounded-2xl" />
      </Lazy>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query'
  import axios from 'axios'
  import { computed, ref } from 'vue'

  import { ReportImages } from '@/schemas/report'
  import { _apiRoute } from '@/stores/routes'

  const props = withDefaults(
    defineProps<{
      mode?: string
    }>(),
    { mode: 'latest' }
  )

  const { data: report } = useQuery({
    queryKey: ['reports', props.mode],
    queryFn: async () => {
      const url = `${_apiRoute('reports')}/${props.mode}`
      const { data } = await axios.get(url)
      return ReportImages.parse(data)
    },
  })

  const bodyEl = ref()
  const showLazyItems = ref(false)
  const elStyle = ref({})

  const imgs = computed(() => report.value?.files ?? [])
  const sImgs = computed(() => report.value?.staticFiles ?? [])

  const handleImgLoad = (ev: Event) => {
    const { clientHeight, clientWidth } = (ev.target as HTMLImageElement)?.parentElement ?? {
      clientHeight: 0,
      clientWidth: 0,
    }
    elStyle.value = {
      height: `${clientHeight}px`,
      width: `${clientWidth}px`,
    }
    showLazyItems.value = true
  }
</script>
