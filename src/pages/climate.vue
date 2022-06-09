<template>
  <div
    class="bg-gray-300 border-l border-r border-b border-black flex flex-col-reverse md:flex-row py-4 justify-center"
  >
    <div class="flex flex-col">
      <!-- Scenario -->
      <div class="flex flex-col items-center space-y-2 px-6">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Scenario</h3>
        <RowGroupBtns class="text-xs" :buttons="scenarios" v-model:activeBtn="activeScenario" />
      </div>
      <!-- Variables -->
      <div class="flex flex-col items-center space-y-2 px-6 min-w-max w-2/5 md:w-full mx-auto">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Variable</h3>
        <div
          v-for="climVar in climateVariables"
          :key="climVar.varName"
          class="w-40 flex justify-center text-center text-gray-200 font-bold py-2 px-4 rounded-lg"
          :class="{
            'bg-blue-600': climVar.varName === activeVariable,
            'cursor-pointer bg-gray-700 hover:bg-gray-500 hover:text-white': climVar.varName !== activeVariable,
          }"
          @click="activeVariable = climVar.varName"
        >
          {{ climVar.desc }}
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center space-y-2 w-full md:mx-20">
      <h2 class="text-center font-semibold text-2xl md:text-4xl">Climate Anomaly</h2>
      <div class="flex flex-col w-1/2">
        <fieldset class="w-full mb-2">
          <input
            type="range"
            name="decade"
            :min="minDecade"
            :max="maxDecade"
            step="10"
            v-model.number="activeDecade"
            class="relative w-full h-2 -bottom-1 m-0 cursor-pointer"
          />
          <svg
            class="w-full px-2 overflow-visible stroke-current text-gray-500"
            role="presentation"
            height="5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              v-for="(d, i) in decades"
              :key="d[0]"
              class=""
              :x="`${(100 * i) / (decades.length - 1)}%`"
              y="3"
              width="0.5"
              height="5"
            ></rect>
          </svg>
          <svg
            class="w-full px-2 overflow-visible mt-1"
            role="presentation"
            height="10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              v-for="(d, i) in decades"
              :key="d[0]"
              class="text-xs font-semibold"
              :x="`${(100 * i) / (decades.length - 1)}%`"
              y="10"
              text-anchor="middle"
            >
              {{ d[0] }}
            </text>
          </svg>
        </fieldset>
      </div>
      <img class="shadow-md rounded-2xl" :src="imgSrc" />
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
  const imgSrcDir = 'resources/climate/img'
  const scenarios = [
    { val: 'RCP45', text: 'RCP45' },
    { val: 'RCP85', text: 'RCP85' },
  ]
  const climateVariables = [
    { varName: 'tmean', desc: 'Daily Average Temperature' },
    { varName: 'tmin', desc: 'Daily Minimum Temperature' },
    { varName: 'tmax', desc: 'Daily Maximum Temperature' },
    { varName: 'precip', desc: 'Daily Rainfall' },
  ]
  const decades = [
    [2020, 2029],
    [2030, 2039],
    [2040, 2049],
    [2050, 2059],
    [2060, 2069],
    [2070, 2079],
    [2080, 2089],
    [2090, 2099],
  ]

  const activeScenario = ref(scenarios[0])
  const activeVariable = ref('tmean')
  const activeDecade = ref(2020)

  const minDecade = computed(() => {
    const vals = decades.map((v) => v[0])
    return Math.min(...vals)
  })

  const maxDecade = computed(() => {
    const vals = decades.map((v) => v[0])
    return Math.max(...vals)
  })

  const imgSrc = computed(() => {
    const [sYear, eYear] = decades.find((d) => d[0] === activeDecade.value) ?? [0, 0]
    return `${imgSrcDir}/ens_${activeScenario.value.val}_${activeVariable.value}_${sYear}-${eYear}_anomaly_timmean.png`
  })
</script>
