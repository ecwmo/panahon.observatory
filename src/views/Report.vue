<template>
  <div class="bg-gray-300 border-l border-r border-b border-black flex flex-col">
    <div class="m-6 space-y-6">
      <img
        v-for="(img, idx) in imgSrcs.reportImgs"
        :key="idx"
        class="border border-black shadow-md rounded-2xl"
        :src="img.imgSrc"
      />
    </div>
    <div class="mx-6 border border-black shadow-md rounded-2xl bg-white" v-show="showStaticImgs">
      <h1 class="p-3 text-5xl font-bold">Additional Information</h1>
    </div>
    <div class="m-6 space-y-6">
      <img
        v-for="(img, idx) in imgSrcs.staticImgs"
        :key="idx"
        class="border border-black shadow-md rounded-2xl"
        :src="img.imgSrc"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import axios from 'axios'

  interface Images {
    [key: string]: { imgSrc: string; show: boolean }[]
  }

  const imgRefs = ref(<Element[]>[])
  const imgSrcs = ref(<Images>{})
  const route = useRoute()

  const showStaticImgs = computed(() => (imgSrcs.value.staticImgs ? imgSrcs.value.staticImgs.length > 0 : false))

  onMounted(async () => {
    const rData = await axios.get(`/api/report.php?view=${route.query.view}`).then(({ data }) => data)

    const reportImgs = rData.reportImgs.map((imgSrc: string, idx: number) => ({
      show: idx < 1 ? true : false,
      imgSrc,
    }))

    const staticImgs = rData.staticImgs.map((imgSrc: string) => ({
      show: false,
      imgSrc,
    }))

    imgSrcs.value = { reportImgs, staticImgs }
  })
</script>
