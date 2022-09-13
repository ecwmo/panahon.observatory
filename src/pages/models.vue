<template>
  <div class="flex flex-col-reverse md:flex-row py-4 justify-center w-full">
    <div class="flex flex-col">
      <!-- Forecast Length -->
      <div v-show="showFcstTime" class="flex flex-col items-center space-y-2 px-6">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Forecast Length</h3>
        <RowGroupBtns v-model:activeBtn="activeFcstTime" class="text-xs" :buttons="fcstTimes" />
      </div>
      <!-- Fields -->
      <div class="flex flex-col items-center space-y-2 px-6 min-w-max w-2/5 md:w-full mx-auto">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Fields</h3>
        <Button
          v-for="mf in metFields"
          :key="mf.val"
          :is-active="mf.val === activeVariable.val"
          class="w-full flex justify-center font-bold py-2 px-4 rounded"
          @click.prevent="activeVariable = mf"
          >{{ mf.text }}</Button
        >
      </div>
    </div>
    <div class="flex flex-col items-center space-y-2 w-full md:mx-20">
      <h2 class="text-center font-semibold text-2xl md:text-4xl">{{ headerName }}</h2>
      <SwitchGroup v-show="varNameX">
        <div class="flex items-center gap-1.5">
          <Switch
            v-model="extremeToggle"
            :class="extremeToggle ? 'bg-skin-button' : 'bg-skin-button-accent'"
            class="relative inline-flex h-4 w-8 items-center rounded-full transition-colors ring-1 ring-gray-700 ring-offset-1"
          >
            <span
              :class="extremeToggle ? 'translate-x-4 bg-skin-button-accent' : 'bg-skin-button translate-x-0'"
              class="inline-block h-3.5 w-3.5 transform rounded-full transition-transform"
            />
          </Switch>
          <SwitchLabel class="text-sm">Show extreme</SwitchLabel>
        </div>
      </SwitchGroup>
      <img class="shadow-md rounded-2xl" :src="imgSrc" />
      <div
        class="italic text-xs md:text-sm mx-2 md:mx-5 font-medium text-justify self-center break-words md:break-normal model-caption w-11/12"
      >
        <component :is="caption"></component>
      </div>
      <div
        v-show="captionX && extremeToggle"
        class="italic text-xs md:text-sm mx-2 md:mx-5 font-medium text-justify self-center break-words md:break-normal model-caption w-11/12"
      >
        <component :is="captionX"></component>
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
  const imgSrcs = ref([])

  const extremeToggle = ref(false)

  const varNameX = computed(() => (activeVariable.value.val === 'rain' ? 'rainx' : ''))
  const headerName = computed(() => activeVariable.value.headerName ?? defaultHeaderName)

  const showFcstTime = computed(() => activeVariable.value.val !== 'wrf-ts')

  const imgSrc = computed(() => {
    const name = extremeToggle.value && varNameX.value ? varNameX.value : activeVariable.value.val
    const pattern = !showFcstTime.value ? `${name}_` : `${activeFcstTime.value.val}hr_${name}_`
    return imgSrcs.value.find((f: string) => f.includes(pattern))
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
    @apply underline text-skin-link;
  }

  .model-caption a:hover {
    @apply underline text-skin-link-active;
  }
</style>
