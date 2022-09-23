<template>
  <div class="flex flex-col">
    <div class="m-6 space-y-6">
      <img
        v-for="(img, idx) in imgSrcs?.reportImgs"
        :key="idx"
        class="border border-black shadow-md rounded-2xl"
        :src="img.imgSrc"
      />
    </div>
    <div v-show="showStaticImgs" class="mx-6 border border-black shadow-md rounded-2xl bg-white">
      <h1 class="p-3 text-5xl font-bold">Additional Information</h1>
    </div>
    <div class="m-6 space-y-6">
      <img
        v-for="(img, idx) in imgSrcs?.staticImgs"
        :key="idx"
        class="border border-black shadow-md rounded-2xl"
        :src="img.imgSrc"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Image {
    imgSrc: string
    show: boolean
  }

  const imgSrcs = ref()
  const route = useRoute()

  const showStaticImgs = computed(() => (imgSrcs.value?.staticImgs as Image[])?.length > 0)

  onMounted(async () => {
    const rData = await axios.get(`/api/report.php?view=${route.query.view}`).then(({ data }) => data)

    const reportImgs: Image[] = rData.reportImgs.map((imgSrc: string, idx: number) => ({
      show: idx < 1 ? true : false,
      imgSrc,
    }))

    const staticImgs: Image[] = rData.staticImgs.map((imgSrc: string) => ({
      show: false,
      imgSrc,
    }))

    imgSrcs.value = { reportImgs, staticImgs }
  })
</script>
