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
      <div class="flex flex-col justify-center px-4 relative">
        <div v-show="showExtremeToggle" class="absolute top-1.5 left-5 p-2 flex justify-center">
          <label for="toogleButton" class="flex items-center cursor-pointer">
            <!-- toggle -->
            <div class="relative">
              <input id="toogleButton" type="checkbox" class="hidden" v-model="extremeToggle" />
              <!-- path -->
              <div
                class="toggle-path w-9 h-5 border rounded-full shadow-inner"
                :class="extremeToggle ? 'bg-red-600' : 'bg-red-200'"
              ></div>
              <!-- crcle -->
              <div
                class="toggle-circle absolute w-3.5 h-3.5 bg-white rounded-full shadow inset-y-0 left-0"
                :class="{ 'translate-x-full': extremeToggle }"
              ></div>
            </div>
            <div class="px-2" :class="extremeToggle ? 'text-red-600' : 'text-red-200'">Extreme</div>
          </label>
        </div>
        <img class="object-scale-down shadow-md rounded-2xl" :src="imgSrc" />
      </div>
      <div
        class="text-sm mx-5 font-semibold text-justify self-center break-words md:break-normal model-caption w-11/12"
        v-html="caption"
        v-show="caption"
      ></div>
      <div
        class="italic text-sm mx-5 font-medium text-justify self-center break-words md:break-normal model-caption w-11/12"
      >
        <span class="font-bold">DISCLAIMER</span>: This website contains experimental forecasts for research purposes.
        For official updates and warnings, please refer to PAGASA and other government agencies.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'

  export default defineComponent({
    setup() {
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
        { varName: 'rain', text: 'Daily Rainfall', hasFcstTime: true, varNameX: 'rainx' },
        { varName: 'temp', text: 'Temperature', hasFcstTime: true },
        {
          varName: 'hix',
          text: 'Max Heat Index',
          hasFcstTime: true,
          caption: `
    The figure above shows the spatial map of forecast heat stress index (HI).
    The HI calculation is based on
      <a
        href="https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml"
        target="_blank" rel="noopener noreferrer">Rothfusz (1990)</a>.
      <img src="resources/model/static/heat_index_static_table.png" class="model-caption-img" />`,
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
          caption: `
    The Wind Power Potential plot uses 100-m wind speed of the model output to approximate the wind
    speed at 80-m, the typical height of wind turbines.
    `,
        },
        {
          varName: 'ppv',
          text: 'Solar Power Forecast',
          hasFcstTime: true,
          caption: `
    The equations used for calculating Photovoltaic Power Potential were based on
      <a
        href="https://pubs.rsc.org/lv/content/articlelanding/2011/ee/c1ee01495a/unauth#!divAbstract"
        target="_blank" rel="noopener noreferrer">Crook et al. (2011)</a>.`,
        },
      ]

      const fcstTime = ref(24)
      const varName = ref('rain')

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
        return !activeVariable.value.hasFcstTime
          ? `${imgSrcDir}/${name}_latest.png`
          : `${imgSrcDir}/wrf-${fcstTime.value}hr_${name}_latest.png`
      })

      const caption = computed(() => activeVariable.value.caption)

      return {
        fcstTimes,
        metFields,
        fcstTime,
        varName,
        headerName,
        imgSrc,
        caption,
        showFcstTime,
        showExtremeToggle,
        extremeToggle,
      }
    },
  })
</script>

<style>
  .model-caption a {
    @apply underline text-blue-600;
  }

  .model-caption a:hover {
    @apply underline text-blue-400;
  }

  .model-caption-img {
    @apply pt-5;
  }

  .toggle-path {
    transition: background 0.3s ease-in-out;
  }

  .toggle-circle {
    top: 0.2rem;
    left: 0.25rem;
    transition: all 0.3s ease-in-out;
  }
</style>
