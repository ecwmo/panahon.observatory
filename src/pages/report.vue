<template>
  <div class="flex flex-col">
    <div class="m-6 space-y-6">
      <img
        class="border border-black shadow-md rounded-2xl"
        :src="imgSrcs?.reportImgs[0]"
        @load="handleStaticImageLoad"
        @error="handleStaticImageLoad"
      />
      <img
        v-for="(img, idx) in imgSrcs?.reportImgs.slice(1)"
        :key="idx"
        ref="imgEls"
        class="border border-black shadow-md rounded-2xl"
        :data-url="img"
      />
    </div>
    <div v-show="showStaticImgs" class="mx-6 border border-black shadow-md rounded-2xl bg-white">
      <h1 class="p-3 text-5xl font-bold">Additional Information</h1>
    </div>
    <div ref="staticImgSection" class="m-6 space-y-6">
      <img
        v-for="(img, idx) in imgSrcs?.staticImgs"
        :key="idx"
        ref="staticImgEls"
        class="border border-black shadow-md rounded-2xl"
        :data-url="img"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const imgSrcs = ref()
  const route = useRoute()

  const imgEls = ref([] as HTMLImageElement[])
  const staticImgEls = ref([] as HTMLImageElement[])
  const showStaticImgs = computed(() => imgSrcs.value?.staticImgs?.length > 0)

  const handleStaticImageLoad = () => {
    const img = [...imgEls.value, ...staticImgEls.value].filter(
      ({ src, dataset: { url } }) => url !== undefined && src.length === 0
    )?.[0]

    if (img) {
      const { stop } = useIntersectionObserver(img, ([{ isIntersecting }]) => {
        if (isIntersecting) {
          img.onload = handleStaticImageLoad
          img.onerror = handleStaticImageLoad
          img.src = img.dataset.url ?? ''
          stop()
        }
      })
    }
  }

  onMounted(async () => {
    imgSrcs.value = await axios.get(`/api/report.php?view=${route.query.view}`).then(({ data }) => data)
  })
</script>
