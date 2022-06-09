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
        <div
          v-for="mf in metFields"
          :key="mf.varName"
          class="w-full flex justify-center text-gray-200 font-bold py-2 px-4 rounded-lg"
          :class="{
            'bg-blue-600': mf.varName === varName,
            'cursor-pointer bg-gray-700 hover:bg-gray-500 hover:text-white': mf.varName !== varName,
          }"
          @click="varName = mf.varName"
        >
          {{ mf.text }}
        </div>
      </div>
    </div>
    <div class="flex flex-col space-y-2 w-full md:mx-20">
      <h2 class="text-center font-semibold text-2xl md:text-4xl">{{ headerName }}</h2>
      <Switch
        class="text-sm md:text-base"
        v-show="showExtremeToggle"
        v-model:isOn="extremeToggle"
        label="Show extreme"
      />
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
      varName: 'rain',
      text: 'Daily Rainfall',
      varNameX: 'rainx',
      captionX: CaptionModelRainx,
    },
    { varName: 'temp', text: 'Temperature' },
    {
      varName: 'hix',
      text: 'Max Heat Index',
      caption: CaptionModelHix,
    },
    { varName: 'rh', text: 'Relative Humidity' },
    { varName: 'wind', text: 'Winds' },
    {
      varName: 'wrf-ts',
      text: 'Hourly Forecasts',
      headerName: 'Hourly Forecasts',
    },
    {
      varName: 'wpd',
      text: 'Wind Power Forecast',
      caption: CaptionModelWpd,
    },
    {
      varName: 'ppv',
      text: 'Solar Power Forecast',
      caption: CaptionModelPpv,
    },
  ]

  const activeFcstTime = ref(fcstTimes[0])
  const varName = ref('rain')
  const imgSrcs = ref(<string[]>[])

  const extremeToggle = ref(false)

  const activeVariable = computed(() => metFields.find(({ varName: v }) => v === varName.value) ?? metFields[0])

  const headerName = computed(() => activeVariable.value.headerName ?? defaultHeaderName)

  const showFcstTime = computed(() => activeVariable.value.varName !== 'wrf-ts')

  const showExtremeToggle = computed(() => activeVariable.value.varNameX !== undefined)

  const imgSrc = computed(() => {
    const name =
      extremeToggle.value && activeVariable.value.varNameX !== undefined
        ? activeVariable.value.varNameX
        : activeVariable.value.varName
    const pattern = !showFcstTime.value ? `${name}_` : `${activeFcstTime.value.val}hr_${name}_`
    return imgSrcs.value.find((f) => f.includes(pattern))
  })

  const caption = computed(() => activeVariable.value.caption)
  const captionX = computed(() => activeVariable.value.captionX)

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
