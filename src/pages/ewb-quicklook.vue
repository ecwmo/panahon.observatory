<template>
  <div class="bg-gray-300 border-l border-r border-b border-black flex flex-col">
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="jtwcImg" />
    </div>
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="pagasaTCThreatImg" />
    </div>

    <table class="table-auto md:m-6">
      <thead>
        <tr>
          <th class="w-1/12"></th>
          <th v-for="ft in fcstTimes" :key="`hd_${ft.text}`">{{ ft.text }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(mf, imf) in metFields" :key="mf.val">
          <th class="w-1/12 h-44 writing-mode-vertical-rl rotate-180">{{ mf.text }}</th>
          <td v-for="(ft, ift) in fcstTimes" :key="ft.text" @click="handleThumbnailClick(imf, ift, 'fcst')">
            <img class="border cursor-pointer hover:border-black" :src="getFcstImg(mf.val, ft.text)" />
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table-auto md:m-6">
      <thead>
        <tr>
          <th class="w-1/12"></th>
          <th v-for="ot in obsTimes" :key="`hd_${ot.text}`">{{ ot.text }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(obs, iobs) in obsTypes" :key="obs.val">
          <th class="w-1/12 writing-mode-vertical-rl rotate-180">{{ obs.text }}</th>
          <td v-for="(ot, iot) in obsTimes" :key="ot.text" @click="handleThumbnailClick(iobs, iot, 'obs')">
            <img class="border cursor-pointer hover:border-black" :src="getObsImg(obs.val, ot.text)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="imgPopUp"
        class="flex fixed w-full h-screen top-0 left-0 bg-black bg-opacity-50 z-50"
        @click="imgPopUp = false"
      >
        <div class="absolute top-2 right-2 cursor-pointer" @click="imgPopUp = false">
          <i class="fa-solid fa-xmark text-white text-3xl"></i>
        </div>
        <div class="flex relative h-screen m-auto py-5">
          <img
            v-if="activeImgType === 'fcst'"
            class="object-cover rounded-2xl drop-shadow-xl"
            :src="getFcstImg(activeMetField.val, activeFcstTime.text)"
          />
          <img
            v-else
            class="object-cover rounded-2xl drop-shadow-xl"
            :src="getObsImg(activeObsType.val, activeObsTime.text)"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import axios from 'axios'

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

  onMounted(async () => {
    imgSrcs.value = await axios.get(`/api/forecast.php?img`).then(({ data }) => data)
  })
</script>

<style>
  .modal-enter-from {
    opacity: 0;
  }

  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-from .modal-container,
  .modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .writing-mode-vertical-rl {
    writing-mode: vertical-rl;
  }
</style>
