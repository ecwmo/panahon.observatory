<template>
  <div class="flex flex-col justify-between items-center">
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="ewb.data?.jtwc" />
    </div>
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="ewb.data?.pagasa" />
    </div>

    <div v-for="section in sections" :key="section.name" class="md:m-6">
      <table class="table-auto text-xs md:text-base">
        <thead>
          <tr>
            <th></th>
            <th v-for="h in section.header" :key="`hd_${section.name}_${h.text}`">{{ h.text }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, gIdx) in section.data" :key="`bdy_${section.name}_${d.id}`">
            <th class="[writing-mode:vertical-rl] rotate-180 h-min">
              {{ d.text }}
            </th>
            <td
              v-for="(imgSrc, imgIdx) in d.imgs"
              :key="imgSrc"
              class="w-1/5"
              @click="handleThumbnailClick(imgIdx, gIdx, section.name)"
            >
              <img class="border cursor-pointer hover:border-black" :src="imgSrc" />
            </td>
            <td v-for="i in section?.fill_end" :key="`filld_${i}`" class="w-1/5"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ImageModal
    :open="imgPopUp"
    @close="imgPopUp = false"
    @up="ewb.up"
    @right="ewb.next"
    @down="ewb.down"
    @left="ewb.prev"
  >
    <img class="object-contain rounded-2xl drop-shadow-xl" :src="ewb.activeImage" />
  </ImageModal>
</template>

<script setup lang="ts">
  import { EWBIntImages } from '@/types/ewb'
  const imgPopUp = ref(false)

  const ewb = useEWBStore()

  const sections = computed(() => [
    {
      name: 'fcst',
      header: ewb.metadata.fcst.variants,
      data: ewb.metadata.fcst.items.map((d) => ({ ...d, imgs: ewb.data?.fcst[d.id as keyof EWBIntImages['fcst']] })),
    },
    {
      name: 'fcstAccum',
      header: ewb.metadata.fcstAccum.variants,
      data: ewb.metadata.fcstAccum.items.map((d) => ({
        ...d,
        imgs: ewb.data?.fcstAccum[d.id as keyof EWBIntImages['fcstAccum']],
      })),
      fill_end: 2,
    },
    {
      name: 'obs',
      header: ewb.metadata.obs.variants,
      data: ewb.metadata.obs.items.map((d) => ({ ...d, imgs: ewb.data?.obs[d.id as keyof EWBIntImages['obs']] })),
    },
  ])

  const handleThumbnailClick = (imgIdx: number, grpIdx: number, imgType: string) => {
    ewb.setActiveImage(imgIdx, grpIdx, imgType)
    imgPopUp.value = true
  }
</script>
