<template>
  <div class="flex flex-col justify-between items-center">
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="ewbImgs?.jtwc" />
    </div>
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="ewbImgs?.pagasa" />
    </div>

    <div class="md:m-6">
      <table class="table-auto">
        <thead>
          <tr>
            <th></th>
            <th v-for="ft in fcstTimes" :key="`hd_${ft.text}`">{{ ft.text }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fvar, gIdx) in fcstVars" :key="fvar.id">
            <th class="[writing-mode:vertical-rl] rotate-180">{{ fvar.text }}</th>
            <td
              v-for="(imgSrc, imgIdx) in ewbImgs?.fcst?.[fvar.id]"
              :key="imgSrc"
              @click="handleThumbnailClick(imgIdx, gIdx, 'fcst')"
            >
              <img class="border cursor-pointer hover:border-black" :src="imgSrc" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="md:m-6">
      <table class="table-auto">
        <thead>
          <tr>
            <th></th>
            <th v-for="ot in obsTimes" :key="`hd_${ot.text}`">{{ ot.text }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(obs, gIdx) in obsTypes" :key="obs.id">
            <th class="[writing-mode:vertical-rl] rotate-180">{{ obs.text }}</th>
            <td
              v-for="(imgSrc, imgIdx) in ewbImgs?.obs?.[obs.id]"
              :key="imgSrc"
              @click="handleThumbnailClick(imgIdx, gIdx, 'obs')"
            >
              <img class="border cursor-pointer hover:border-black" :src="imgSrc" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ImageModal
    :open="imgPopUp"
    @close="imgPopUp = false"
    @up="handleUpBtnClick"
    @right="handleNextBtnClick"
    @down="handleDownBtnClick"
    @left="handlePrevBtnClick"
  >
    <img class="object-contain rounded-2xl drop-shadow-xl" :src="activeImg" />
  </ImageModal>
</template>

<script setup lang="ts">
  import { Images } from '@/schemas/ewb'
  import type { DynamicImages, ForecastVariables, ObservationTypes } from '@/types/ewb'

  const imgPopUp = ref(false)
  const activeImgType = ref('fcst')
  const activeGroupIdx = ref(0)
  const activeIdx = ref(0)

  const fcstVars: ForecastVariables = [
    {
      id: 'rain',
      text: 'Daily Rainfall',
    },
    {
      id: 'rainx',
      text: 'Extreme Daily Rainfall',
    },
    { id: 'wind', text: 'Winds' },
    {
      id: 'hix',
      text: 'Max Heat Index',
    },
  ]

  const fcstTimes = [
    { val: 24, text: '24hr' },
    { val: 48, text: '48hr' },
    { val: 72, text: '72hr' },
    { val: 96, text: '96hr' },
    { val: 120, text: '120hr' },
  ]

  const obsTypes: ObservationTypes = [
    {
      id: 'gsmap',
      text: 'GSMap',
    },
    {
      id: 'station',
      text: 'Stations',
    },
  ]

  const obsTimes = [
    { val: 1, text: '1day' },
    { val: 3, text: '3day' },
    { val: 5, text: '5day' },
    { val: 7, text: '7day' },
    { val: 30, text: '30day' },
  ]

  const { data: ewbImgs } = useQuery(
    ['ewbImgs'],
    async () => await axios('api/ewb.php').then(({ data }) => Images.parse(data))
  )

  const activeVars = computed(() => (activeImgType.value === 'fcst' ? fcstVars : obsTypes))

  const activeImgs = computed(() => {
    const imgs = ewbImgs.value?.[activeImgType.value as keyof DynamicImages]
    const activeVar = activeVars.value[activeGroupIdx.value].id
    return (imgs as { [key: string]: string[] })?.[activeVar]
  })

  const activeImg = computed(() => activeImgs.value[activeIdx.value])

  const handleThumbnailClick = (imgIdx: number, grpIdx: number, imgType: string) => {
    activeImgType.value = imgType
    activeIdx.value = imgIdx
    activeGroupIdx.value = grpIdx
    imgPopUp.value = true
  }

  const handleUpBtnClick = () => {
    activeGroupIdx.value = activeGroupIdx.value === 0 ? activeVars.value.length - 1 : activeGroupIdx.value - 1
  }

  const handleDownBtnClick = () => {
    activeGroupIdx.value = activeGroupIdx.value === activeVars.value.length - 1 ? 0 : activeGroupIdx.value + 1
  }

  const handlePrevBtnClick = () => {
    activeIdx.value = activeIdx.value === 0 ? activeImgs.value.length - 1 : activeIdx.value - 1
  }

  const handleNextBtnClick = () => {
    activeIdx.value = activeIdx.value === activeImgs.value.length - 1 ? 0 : activeIdx.value + 1
  }
</script>
