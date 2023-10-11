import { action, atom, computed } from 'nanostores'

import type { ObservationVariableEnums, ObservationVariables, StationProperties } from '@/types/station'

export const $viewType = atom('default')
export const setViewType = action($viewType, 'setViewType', (vt, newType: string) => vt.set(newType))

export const $validationTS = atom(new Date())
export const setValidationTS = action($validationTS, 'setValidationTS', (vTS, newVal: Date) => vTS.set(newVal))

export const $activeVariable = atom('temp')
export const setActiveVariable = action($activeVariable, 'setActiveVariable', (v, newVar: string) => v.set(newVar))

export const $activeStation = atom<StationProperties>({})
export const setActiveStation = action(
  $activeStation,
  'setActiveStation',
  (st, stations: StationProperties[], newStn?: number | string | StationProperties) => {
    if (newStn) {
      st.set(
        typeof newStn === 'number' || typeof newStn === 'string'
          ? stations?.find(({ id }) => id === newStn) ?? ({} as StationProperties)
          : newStn
      )
    } else {
      st.set(stations?.[0])
    }
  }
)

export const timestamp = computed($activeStation, (st) => new Date(st?.obs?.timestamp ?? Date.now()))

const dataIsValid = (val: number, varName: string) => {
  if (varName === 'pres') return val !== -999
  if (varName === 'wdir') return val >= 0 && val <= 360
  return ![999.9, -999].includes(val)
}

const windDirDeg2Str = (val: number) => {
  if (!dataIsValid(val, 'wdir')) return ''
  if (val <= 22.5) return 'N'
  else if (val <= 45) return 'NNE'
  else if (val <= 67.5) return 'NE'
  else if (val <= 90) return 'ENE'
  else if (val <= 112.5) return 'E'
  else if (val <= 135) return 'ESE'
  else if (val <= 157.5) return 'SE'
  else if (val <= 180) return 'SSE'
  else if (val <= 202.5) return 'S'
  else if (val <= 225) return 'SSW'
  else if (val <= 247.5) return 'SW'
  else if (val <= 270) return 'WSW'
  else if (val <= 292.5) return 'W'
  else if (val <= 315) return 'WNW'
  else if (val <= 337.5) return 'NW'
  else return 'NNW'
}

const metValueString = (stnObs: ObservationVariables | undefined, varName: string) => {
  let fracDigits = 1
  const val = (stnObs?.[varName as ObservationVariableEnums] as number) ?? -999
  if (varName === 'wdirStr') {
    return windDirDeg2Str(stnObs?.['wdir' as ObservationVariableEnums] as number)
  }
  if (!dataIsValid(val, varName)) return '--'
  if (['rr', 'rain24h', 'pres'].indexOf(varName) !== -1) {
    fracDigits = 0
  }
  return val.toFixed(fracDigits)
}

export const metValueStrings = computed($activeStation, (st) => {
  const ret: { [k: string]: string } = {}
  const metVars = ['rr', 'rain24h', 'temp', 'hi', 'tx', 'tn', 'wspd', 'wdirStr', 'pres']

  metVars.forEach((v) => {
    ret[v] = metValueString(st?.obs, v)
  })

  return ret
})
