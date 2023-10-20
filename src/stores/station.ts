import { action, atom, computed } from 'nanostores'

import { windDirDeg2Str } from '@/lib/weather'

import type { ObservationKeys, StationObs } from '@/types/station'

export const $viewType = atom('default')
export const setViewType = action($viewType, 'setViewType', (vt, newType: string) => vt.set(newType))

export const $activeVariable = atom('temp')
export const setActiveVariable = action($activeVariable, 'setActiveVariable', (v, newVar: string) => v.set(newVar))

export const defaultStation: StationObs = { id: -1, name: '', lat: 0, lon: 0, obs: {} }
export const $activeStation = atom<StationObs>(defaultStation)
export const setActiveStation = action($activeStation, 'setActiveStation', (st, newStn: StationObs) => {
  st.set(newStn)
})

export const $activeStationTs = computed($activeStation, (st) =>
  st && 'obs' in st && st.obs && st.obs.timestamp ? new Date(st.obs.timestamp) : null
)

const dataIsValid = (val: number, varName: string) => {
  if (varName === 'pres') return val !== -999
  if (varName === 'wdir') return val >= 0 && val <= 360
  return ![999.9, -999].includes(val)
}

const toFixed = (o: Record<string, any>, k: string, fDigits: number) => {
  const v = o?.[k]
  return typeof v === 'number' && dataIsValid(v, k) ? v.toFixed(fDigits) : '--'
}

type ObservationStr = {
  [K in ObservationKeys | 'wdirStr']: string
}
export const $activeStationObsStr = computed($activeStation, (stn) => {
  if (stn && 'obs' in stn) {
    const { obs } = stn
    const keys = ['temp', 'wspd', 'gust', 'tn', 'tx', 'hi', 'rh', 'rain', 'rainAccum', 'mslp']
    const oStr = keys.reduce((o, k) => {
      const fDigits = k in ['rh', 'rain', 'rainAccum', 'mslp'] ? 0 : 1
      const valStr = toFixed(obs, k, fDigits)
      return {
        ...o,
        [k]: valStr,
      }
    }, {} as ObservationStr)
    oStr.wdirStr = windDirDeg2Str(obs?.wdir ?? 0)
    return oStr
  }
  return {} as ObservationStr
})
