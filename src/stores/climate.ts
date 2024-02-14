import { action, atom, computed } from 'nanostores'

import { route } from '@/stores/routes'

const imgSrcPath = route('resources/climate/img')

export const scenarios = [
  { val: 'RCP45', text: 'RCP45' },
  { val: 'RCP85', text: 'RCP85' },
]

export const variables = [
  { val: 'tmean', text: 'Daily Average Temperature' },
  { val: 'tmin', text: 'Daily Minimum Temperature' },
  { val: 'tmax', text: 'Daily Maximum Temperature' },
  { val: 'precip', text: 'Daily Rainfall' },
]

export const decades = [
  [2020, 2029],
  [2030, 2039],
  [2040, 2049],
  [2050, 2059],
  [2060, 2069],
  [2070, 2079],
  [2080, 2089],
  [2090, 2099],
]

export const $activeScenario = atom(scenarios[0])
export const setActiveScenario = action($activeScenario, 'setActiveScenario', (s, newName: string) => {
  const newScenario = scenarios.find((s) => s.val === newName)
  if (newScenario) s.set(newScenario)
})

export const $activeVariable = atom(variables[0])
export const setActiveVariable = action($activeVariable, 'setActiveVariable', (v, newVal) => v.set(newVal))

export const $activeDecade = atom(2020)
export const setActiveDecade = action($activeDecade, 'setActiveDecade', (dec, newVal) => dec.set(newVal))

export const $activeImage = computed([$activeDecade, $activeScenario, $activeVariable], (dec, scen, v) => {
  const [sYear, eYear] = decades.find((d) => d[0] === dec) ?? [0, 0]
  return `${imgSrcPath}/ens_${scen.val}_${v.val}_${sYear}-${eYear}_anomaly_timmean.png`
})
