import { action, atom, computed } from 'nanostores'

import { windDirDeg2Str } from '@/lib/weather'

import type { Observation, ObservationKeys, StationObsLatest } from '@/types/station'

export const $viewType = atom('default')
export const setViewType = action($viewType, 'setViewType', (vt, newType: string) => vt.set(newType))

export const $validationTS = atom(new Date())
export const setValidationTS = action($validationTS, 'setValidationTS', (vTS, newVal: Date) => vTS.set(newVal))

export const $activeVariable = atom('temp')
export const setActiveVariable = action($activeVariable, 'setActiveVariable', (v, newVar: string) => v.set(newVar))

export const defaultStation: StationObsLatest = { id: -1, name: '', lat: 0, lon: 0, obs: {} }
export const $activeStation = atom(defaultStation)
export const setActiveStation = action($activeStation, 'setActiveStation', (st, newStn: StationObsLatest) => {
  st.set(newStn)
})

export const $timestamp = computed($activeStation, (st) => new Date(st?.obs?.timestamp ?? Date.now()))

const dataIsValid = (val: number, varName: string) => {
  if (varName === 'pres') return val !== -999
  if (varName === 'wdir') return val >= 0 && val <= 360
  return ![999.9, -999].includes(val)
}

type ObsKeys = ObservationKeys | 'wdirStr' | 'hi'
const metValueString = (stnObs: Observation | undefined, varName: ObsKeys) => {
  let fracDigits = 1
  const val = (stnObs?.[varName as ObservationKeys] as number) ?? -999
  if (varName === 'wdirStr') {
    return windDirDeg2Str(stnObs?.['wdir'] as number)
  }
  if (!dataIsValid(val, varName)) return '--'
  if (['rain', 'rainAccum', 'mslp'].indexOf(varName) !== -1) {
    fracDigits = 0
  }
  return val.toFixed(fracDigits)
}

export const $metValueStrings = computed($activeStation, (st) => {
  const ret: { [k: string]: string } = {}
  const metVars = ['rain', 'rainAccum', 'temp', 'hi', 'tx', 'tn', 'wspd', 'wdirStr', 'mslp'] satisfies ObsKeys[]

  metVars.forEach((v) => {
    ret[v] = metValueString(st?.obs, v)
  })

  return ret
})
