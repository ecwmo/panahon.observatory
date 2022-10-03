import { defineStore } from 'pinia'

import { Station as StationSchema, StationConfigurations } from '@/schemas/station'
import type { StationProperties, ObservationVariables, ObservationVariableEnums } from '@/types/station'

export const useStationStore = defineStore('station', () => {
  const activeStation = ref({} as StationProperties)

  const { data } = useQuery(['stations'], async () => {
    const dat = await axios.get('/api/stations.php').then(({ data }) => StationSchema.parse(data))
    activeStation.value = dat.features[0].properties
    return dat
  })

  const { data: stationConf } = useQuery(
    'stationConf',
    async () => await axios.get('/api/stations.php?weather_conf').then(({ data }) => StationConfigurations.parse(data)),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  )

  const stationName = computed(() => activeStation.value.name)
  const timestamp = computed(() => new Date(activeStation.value?.obs?.timestamp ?? Date.now()))

  const { formatDate } = useDate(timestamp.value)
  const dateString = (format = 'MMMM d, yyyy h:00 bbb') => formatDate(format)

  const setActiveStation = (st: StationProperties) => {
    activeStation.value = st
  }

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

  const metValueString = (stnObs: ObservationVariables, varName: string) => {
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

  const metValueStrings = computed(() => {
    const ret: { [k: string]: string } = {}
    const metVars = ['rr', 'rain24h', 'temp', 'hi', 'tx', 'tn', 'wspd', 'wdirStr', 'pres']

    metVars.forEach((v) => {
      ret[v] = metValueString(activeStation.value?.obs, v)
    })

    return ret
  })

  const getSwatch = (varName: string) => {
    const { colors, levels } = stationConf.value?.[varName]?.palette ?? { colors: [], levels: [] }

    return { colors, levels }
  }

  return {
    data,
    stationConf,
    activeStation,
    stationName,
    timestamp,
    metValueStrings,
    dateString,
    getSwatch,
    setActiveStation,
  }
})
