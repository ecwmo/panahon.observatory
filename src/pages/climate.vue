<template>
  <div class="flex flex-col-reverse md:flex-row py-4 justify-center">
    <div class="flex flex-col">
      <!-- Scenario -->
      <div class="flex flex-col items-center space-y-2 px-6">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Scenario</h3>
        <RowGroupBtns v-model:activeBtn="activeScenario" class="text-xs" :buttons="scenarios" />
      </div>
      <!-- Variables -->
      <div class="flex flex-col items-center space-y-2 px-6 min-w-max w-2/5 md:w-full mx-auto">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Variable</h3>
        <Button
          v-for="climVar in climateVariables"
          :key="climVar.val"
          :is-active="climVar.val === activeVariable.val"
          class="w-40 flex justify-center text-center font-bold py-2 px-4 rounded"
          @click.prevent="activeVariable = climVar"
          >{{ climVar.text }}</Button
        >
      </div>
    </div>
    <div class="flex flex-col items-center space-y-2 w-full md:mx-20">
      <h2 class="text-center font-semibold text-2xl md:text-4xl">Climate Anomaly</h2>
      <div class="flex flex-col w-1/2">
        <Range v-model.number="activeDecade" :data="decades.map((d) => d[0])" class="w-full mb-2" />
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
    { val: 'tmean', text: 'Daily Average Temperature' },
    { val: 'tmin', text: 'Daily Minimum Temperature' },
    { val: 'tmax', text: 'Daily Maximum Temperature' },
    { val: 'precip', text: 'Daily Rainfall' },
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
  const activeVariable = ref(climateVariables[0])
  const activeDecade = ref(2020)

  const imgSrc = computed(() => {
    const [sYear, eYear] = decades.find((d) => d[0] === activeDecade.value) ?? [0, 0]
    return `${imgSrcDir}/ens_${activeScenario.value.val}_${activeVariable.value.val}_${sYear}-${eYear}_anomaly_timmean.png`
  })
</script>
