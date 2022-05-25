<template>
  <div
    class="bg-gray-300 border-l border-r border-b border-black flex flex-col-reverse md:flex-row py-4 justify-center w-full"
  >
    <div class="flex flex-col">
      <!-- Forecast Length -->
      <div class="flex flex-col items-center space-y-2 px-6" v-show="showFcstTime">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Forecast Length</h3>
        <div class="flex flex-row text-xs">
          <div
            v-for="(ft, i) in fcstTimes"
            :key="i"
            class="flex text-gray-200 justify-center p-1"
            :class="{
              'rounded-l-lg pl-3': i === 0,
              'rounded-r-lg pr-3': i === 4,
              'border-l border-r border-gray-200': i > 0 && i < 4,
              'bg-blue-600': ft.val === fcstTime,
              'cursor-pointer bg-gray-700 hover:bg-gray-500 hover:text-white': ft.val !== fcstTime,
            }"
            @click="fcstTime = ft.val"
          >
            {{ ft.text }}
          </div>
        </div>
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
    <div class="flex flex-col space-y-2 mx-12 md:w-full">
      <h2 class="text-center font-semibold text-4xl">{{ headerName }}</h2>
      <Switch v-show="showExtremeToggle" v-model:isOn="extremeToggle" label="Show extreme" />
      <div class="flex flex-col justify-center px-4">
        <img class="object-scale-down shadow-md rounded-2xl" :src="imgSrc" />
      </div>
      <div
        class="text-sm mx-5 font-semibold text-justify self-center break-words md:break-normal model-caption w-11/12"
      >
        <component :is="caption"></component>
      </div>
      <div
        class="text-sm mx-5 font-semibold text-justify self-center break-words md:break-normal model-caption w-11/12"
        v-show="captionX && extremeToggle"
      >
        <component :is="captionX"></component>
      </div>
      <div
        class="italic text-sm mx-5 font-medium text-justify self-center break-words md:break-normal model-caption w-11/12"
      >
        <span class="font-bold">DISCLAIMER</span>: This website contains experimental forecasts for research purposes.
        For official updates and warnings, please refer to PAGASA and other government agencies.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'

  import Switch from '@/components/Switch.vue'

  import ModelRainxCaption from '@/components/caption/ModelRainx.vue'
  import ModelHixCaption from '@/components/caption/ModelHix.vue'
  import ModelWpdCaption from '@/components/caption/ModelWpd.vue'
  import ModelPpvCaption from '@/components/caption/ModelPpv.vue'

  const defaultHeaderName = 'Model Forecast Maps'
  const imgSrcDir = 'resources/model/img'
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
      hasFcstTime: true,
      varNameX: 'rainx',
      captionX: ModelRainxCaption,
    },
    { varName: 'temp', text: 'Temperature', hasFcstTime: true },
    {
      varName: 'hix',
      text: 'Max Heat Index',
      hasFcstTime: true,
      caption: ModelHixCaption,
    },
    { varName: 'rh', text: 'Relative Humidity', hasFcstTime: true },
    { varName: 'wind', text: 'Winds', hasFcstTime: true },
    {
      varName: 'wrf-ts',
      text: 'Hourly Forecasts',
      hasFcstTime: false,
      headerName: 'Hourly Forecasts',
    },
    {
      varName: 'wpd',
      text: 'Wind Power Forecast',
      hasFcstTime: true,
      caption: ModelWpdCaption,
    },
    {
      varName: 'ppv',
      text: 'Solar Power Forecast',
      hasFcstTime: true,
      caption: ModelPpvCaption,
    },
  ]

  const fcstTime = ref(24)
  const varName = ref('rain')
  const imgSrcs = ref(<string[]>[])

  const extremeToggle = ref(false)

  const activeVariable = computed(() => metFields.find(({ varName: v }) => v === varName.value) ?? metFields[0])

  const headerName = computed(() => activeVariable.value.headerName ?? defaultHeaderName)

  const showFcstTime = computed(() => activeVariable.value.hasFcstTime)

  const showExtremeToggle = computed(() => activeVariable.value.varNameX !== undefined)

  const imgSrc = computed(() => {
    const name =
      extremeToggle.value && activeVariable.value.varNameX !== undefined
        ? activeVariable.value.varNameX
        : activeVariable.value.varName
    const pattern = !activeVariable.value.hasFcstTime ? `${name}_` : `${fcstTime.value}hr_${name}_`
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
