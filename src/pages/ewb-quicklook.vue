<template>
  <div class="flex flex-col justify-between items-center">
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="jtwcImg" />
    </div>
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="pagasaTCThreatImg" />
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
          <tr v-for="(mf, imf) in metFields" :key="mf.val">
            <th class="[writing-mode:vertical-rl] rotate-180">{{ mf.text }}</th>
            <td v-for="(ft, ift) in fcstTimes" :key="ft.text" @click="handleThumbnailClick(imf, ift, 'fcst')">
              <img class="border cursor-pointer hover:border-black" :src="getFcstImg(mf.val, ft.text)" />
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
          <tr v-for="(obs, iobs) in obsTypes" :key="obs.val">
            <th class="[writing-mode:vertical-rl] rotate-180">{{ obs.text }}</th>
            <td v-for="(ot, iot) in obsTimes" :key="ot.text" @click="handleThumbnailClick(iobs, iot, 'obs')">
              <img class="border cursor-pointer hover:border-black" :src="getObsImg(obs.val, ot.text)" />
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
    <img
      class="object-contain rounded-2xl drop-shadow-xl"
      :src="
        activeImgType === 'fcst'
          ? getFcstImg(activeMetField.val, activeFcstTime.text)
          : getObsImg(activeObsType.val, activeObsTime.text)
      "
    />
  </ImageModal>
</template>

<script setup lang="ts">
  const jtwcImg = 'https://www.metoc.navy.mil/jtwc/products/abpwsair.jpg'
  const pagasaTCThreatImg = 'https://pubfiles.pagasa.dost.gov.ph/climps/tcthreat/TC_Threat_and_S2S_Forecast.png'

  const imgSrcs = ref([])
  const imgPopUp = ref(false)
  const activeImgType = ref()
  const activeMetField = ref()
  const activeFcstTime = ref()
  const activeObsType = ref()
  const activeObsTime = ref()

  const metFields = [
    {
      val: 'rain',
      text: 'Daily Rainfall',
    },
    {
      val: 'rainx',
      text: 'Extreme Daily Rainfall',
    },
    { val: 'wind', text: 'Winds' },
    {
      val: 'hix',
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

  const obsTypes = [
    {
      val: 'gsmap',
      text: 'GSMap',
    },
    {
      val: 'station',
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

  const randomStr = (length = 8) => {
    // Declare all characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    // Pick characers randomly
    let str = ''
    for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return str
  }

  const getFcstImg = (mf: string, fcst: string): string | undefined => {
    const pattern = `${fcst}_${mf}_`
    return imgSrcs.value.find((f: string) => f.includes(pattern))
  }

  const getObsImg = (obsName: string, obsTime: string) => {
    const imgDir = 'resources/model/img/ewb'
    const imgName = `${obsName}_${obsTime}_totalprecip_latest.png`
    return `${imgDir}/${imgName}?rand=${randomStr()}`
  }

  const handleThumbnailClick = (idx: number, idx2: number, imgType: string) => {
    activeImgType.value = imgType
    if (imgType === 'fcst') {
      activeMetField.value = metFields[idx]
      activeFcstTime.value = fcstTimes[idx2]
    }

    activeObsType.value = obsTypes[idx]
    activeObsTime.value = obsTimes[idx2]
    imgPopUp.value = true
  }

  const handleUpBtnClick = () => {
    if (activeImgType.value === 'fcst') {
      const idx = metFields.findIndex((f) => f.val === activeMetField.value.val)
      const newIdx = idx === 0 ? metFields.length - 1 : idx - 1
      activeMetField.value = metFields[newIdx]
    } else {
      const idx = obsTypes.findIndex((f) => f.val === activeObsType.value.val)
      const newIdx = idx === 0 ? obsTypes.length - 1 : idx - 1
      activeObsType.value = obsTypes[newIdx]
    }
  }

  const handleDownBtnClick = () => {
    if (activeImgType.value === 'fcst') {
      const idx = metFields.findIndex((f) => f.val === activeMetField.value.val)
      const newIdx = idx === metFields.length - 1 ? 0 : idx + 1
      activeMetField.value = metFields[newIdx]
    } else {
      const idx = obsTypes.findIndex((f) => f.val === activeObsType.value.val)
      const newIdx = idx === obsTypes.length - 1 ? 0 : idx + 1
      activeObsType.value = obsTypes[newIdx]
    }
  }

  const handlePrevBtnClick = () => {
    if (activeImgType.value === 'fcst') {
      const idx = fcstTimes.findIndex((f) => f.val === activeFcstTime.value.val)
      const newIdx = idx === 0 ? fcstTimes.length - 1 : idx - 1
      activeFcstTime.value = fcstTimes[newIdx]
    } else {
      const idx = obsTimes.findIndex((f) => f.val === activeObsTime.value.val)
      const newIdx = idx === 0 ? obsTimes.length - 1 : idx - 1
      activeObsTime.value = obsTimes[newIdx]
    }
  }

  const handleNextBtnClick = () => {
    if (activeImgType.value === 'fcst') {
      const idx = fcstTimes.findIndex((f) => f.val === activeFcstTime.value.val)
      const newIdx = idx === fcstTimes.length - 1 ? 0 : idx + 1
      activeFcstTime.value = fcstTimes[newIdx]
    } else {
      const idx = obsTimes.findIndex((f) => f.val === activeObsTime.value.val)
      const newIdx = idx === obsTimes.length - 1 ? 0 : idx + 1
      activeObsTime.value = obsTimes[newIdx]
    }
  }

  onMounted(async () => {
    imgSrcs.value = await axios.get(`/api/forecast.php?img`).then(({ data }) => data)
  })
</script>
