import { defineStore } from 'pinia'

export const useClimateStore = defineStore('climate', () => {
  const imgSrcDir = 'resources/climate/img'

  const scenarios = [
    { val: 'RCP45', text: 'RCP45' },
    { val: 'RCP85', text: 'RCP85' },
  ]
  const variables = [
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
  const activeVariable = ref(variables[0])
  const activeDecade = ref(2020)

  const activeImg = computed(() => {
    const [sYear, eYear] = decades.find((d) => d[0] === activeDecade.value) ?? [0, 0]
    return `${imgSrcDir}/ens_${activeScenario.value.val}_${activeVariable.value.val}_${sYear}-${eYear}_anomaly_timmean.png`
  })

  return {
    scenarios,
    variables,
    decades,
    activeScenario,
    activeVariable,
    activeDecade,
    activeImg,
  }
})
