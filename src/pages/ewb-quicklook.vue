<template>
  <div class="bg-gray-300 border-l border-r border-b border-black flex flex-col">
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="jtwcImg" />
    </div>
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="pagasaTCThreatImg" />
    </div>
    <div class="md:m-6">
      <div class="flex">
        <div class="flex flex-col w-full m-2">
          <span
            v-for="mf in metFields"
            :key="mf.val"
            class="flex h-full w-full text-center justify-center items-center -rotate-90"
            >{{ mf.text }}</span
          >
        </div>
        <div v-for="ft in fcstTimes" :key="ft.text" class="flex flex-col justify-center items-center">
          <span>{{ ft.text }}</span>
          <div v-for="mf in metFields" :key="mf.val">
            <img class="border border-black shadow-md rounded-2xl" :src="getFcstImg(mf.val, ft.text)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import axios from 'axios'

  const imgSrcs = ref(<string[]>[])
  const jtwcImg = 'https://www.metoc.navy.mil/jtwc/products/abpwsair.jpg'
  const pagasaTCThreatImg = 'https://pubfiles.pagasa.dost.gov.ph/climps/tcthreat/TC_Threat_and_S2S_Forecast.png'

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

  const getFcstImg = (mf: string, fcst: string) => {
    const pattern = `${fcst}_${mf}_`
    return imgSrcs.value.find((f) => f.includes(pattern))
  }

  onMounted(async () => {
    imgSrcs.value = await axios.get(`/api/forecast.php?img`).then(({ data }) => data)
  })
</script>
