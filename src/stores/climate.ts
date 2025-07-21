import { atom, computed } from 'nanostores'

const imgSrcPath = '/resources/climate/img'

type Item = {
  val: string
  text: string
}

export const scenarios: Item[] = [
  { val: 'RCP45', text: 'RCP45' },
  { val: 'RCP85', text: 'RCP85' },
]

export const variables: Item[] = [
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

export const $activeScenario = atom<Item>(scenarios[0])
export const setActiveScenario = (newName: string) => {
  const newScenario = scenarios.find((s) => s.val === newName)
  if (newScenario) $activeScenario.set(newScenario)
}

export const $activeVariable = atom(variables[0])
export const setActiveVariable = (newVal: Item) => $activeVariable.set(newVal)

export const $activeDecade = atom(2020)
export const setActiveDecade = (newVal: number) => $activeDecade.set(newVal)

export const $activeImage = computed([$activeDecade, $activeScenario, $activeVariable], (dec, scen, v) => {
  const [sYear, eYear] = decades.find((d) => d[0] === dec) ?? [0, 0]
  return `${imgSrcPath}/ens_${scen.val}_${v.val}_${sYear}-${eYear}_anomaly_timmean.png`
})
