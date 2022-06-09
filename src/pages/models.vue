<template>
  <div
    class="bg-gray-300 border-l border-r border-b border-black flex flex-col-reverse md:flex-row py-4 justify-center w-full"
  >
    <div class="flex flex-col">
      <!-- Forecast Length -->
      <div class="flex flex-col items-center space-y-2 px-6" v-show="showFcstTime">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Forecast Length</h3>
        <RowGroupBtns class="text-xs" :buttons="fcstTimes" v-model:activeBtn="activeFcstTime" />
      </div>
      <!-- Fields -->
      <div class="flex flex-col items-center space-y-2 px-6 min-w-max w-2/5 md:w-full mx-auto">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Fields</h3>
        <Button
          v-for="mf in metFields"
          :key="mf.val"
          :label="mf.text"
          :isActive="mf.val === activeVariable.val"
          @click="activeVariable = mf"
          class="w-full flex justify-center font-bold py-2 px-4 rounded-lg"
        />
      </div>
    </div>
    <div class="flex flex-col space-y-2 w-full md:mx-20">
      <h2 class="text-center font-semibold text-2xl md:text-4xl">{{ headerName }}</h2>
      <Switch class="text-sm md:text-base" v-show="varNameX" v-model:isOn="extremeToggle" label="Show extreme" />
      <img class="shadow-md rounded-2xl" :src="imgSrc" />
      <div
        class="italic text-xs md:text-sm mx-2 md:mx-5 font-medium text-justify self-center break-words md:break-normal model-caption w-11/12"
      >
        <component :is="caption"></component>
      </div>
      <div
        class="italic text-xs md:text-sm mx-2 md:mx-5 font-medium text-justify self-center break-words md:break-normal model-caption w-11/12"
        v-show="captionX && extremeToggle"
      >
        <component :is="captionX"></component>
      </div>
      <div
        class="italic text-xs md:text-sm mx-2 md:mx-5 font-medium text-justify self-center break-words md:break-normal model-caption w-11/12"
      >
        <span class="font-bold">DISCLAIMER</span>: This website contains experimental forecasts for research purposes.
        For official updates and warnings, please refer to PAGASA and other government agencies.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import axios from 'axios'

  const CaptionModelRainx = defineAsyncComponent({ loader: () => import('@/components/caption/ModelRainx.vue') })
  const CaptionModelHix = defineAsyncComponent({ loader: () => import('@/components/caption/ModelHix.vue') })
  const CaptionModelWpd = defineAsyncComponent({ loader: () => import('@/components/caption/ModelWpd.vue') })
  const CaptionModelPpv = defineAsyncComponent({ loader: () => import('@/components/caption/ModelPpv.vue') })

  const defaultHeaderName = 'Model Forecast Maps'

  const fcstTimes = [
    { val: 24, text: '24hr' },
    { val: 48, text: '48hr' },
    { val: 72, text: '72hr' },
    { val: 96, text: '96hr' },
    { val: 120, text: '120hr' },
  ]

  const metFields = [
    {
      val: 'rain',
      text: 'Daily Rainfall',
    },
    { val: 'temp', text: 'Temperature' },
    {
      val: 'hix',
      text: 'Max Heat Index',
    },
    { val: 'rh', text: 'Relative Humidity' },
    { val: 'wind', text: 'Winds' },
    {
      val: 'wrf-ts',
      text: 'Hourly Forecasts',
      headerName: 'Hourly Forecasts',
    },
    {
      val: 'wpd',
      text: 'Wind Power Forecast',
    },
    {
      val: 'ppv',
      text: 'Solar Power Forecast',
    },
  ]

  const activeFcstTime = ref(fcstTimes[0])
  const activeVariable = ref(metFields[0])
  const imgSrcs = ref(<string[]>[])

  const extremeToggle = ref(false)

  const varNameX = computed(() => (activeVariable.value.val === 'rain' ? 'rainx' : ''))
  const headerName = computed(() => activeVariable.value.headerName ?? defaultHeaderName)

  const showFcstTime = computed(() => activeVariable.value.val !== 'wrf-ts')

  const imgSrc = computed(() => {
    const name = extremeToggle.value && varNameX.value ? varNameX.value : activeVariable.value.val
    const pattern = !showFcstTime.value ? `${name}_` : `${activeFcstTime.value.val}hr_${name}_`
    return imgSrcs.value.find((f) => f.includes(pattern))
  })

  const caption = computed(() => {
    if (activeVariable.value.val === 'hix') return CaptionModelHix
    if (activeVariable.value.val === 'wpd') return CaptionModelWpd
    if (activeVariable.value.val === 'ppv') return CaptionModelPpv
    return
  })
  const captionX = computed(() => {
    if (activeVariable.value.val === 'rain') return CaptionModelRainx
    return
  })

  onMounted(async () => {
    imgSrcs.value = await axios.get(`/api/forecast.php?img`).then(({ data }) => data)
  })
</script>

<style>
  .model-caption a {
    @apply underline text-blue-600;
  }

  .model-caption a:hover {
    @apply underline text-blue-400;
  }
</style>
