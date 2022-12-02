import { defineStore } from 'pinia'
import { format as dfFormat } from 'date-fns'

import { Station as StationSchema, StationConfigurations } from '@/schemas/station'
import type { StationProperties, ObservationVariables, ObservationVariableEnums } from '@/types/station'

export const useStationStore = defineStore('station', () => {
  const { data: userPosition } = useLocation()
  const viewType = ref('default')
  const validationTS = ref('')

  const { data, status: dataStatus } = useQuery(['stations', viewType, validationTS], async () => {
    const url =
      viewType.value === 'validation'
        ? `/api/stations.php?validation&dt=${validationTS.value ?? ''}`
        : '/api/stations.php'
    const dat = await axios.get(url).then(({ data }) => StationSchema.parse(data))
    return dat
  })

  const { data: stationInfo } = useQuery(['stationInfo'], async () => {
    const dat = await axios.get('/api/stations.php?info').then(({ data }) => StationSchema.parse(data))
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

  const closestPointIdx = computed(() => {
    if (userPosition.value) {
      const { latitude: userLat, longitude: userLng } = userPosition.value

      const d =
        data.value?.features?.map(
          ({ geometry: { coordinates } }) =>
            Math.pow(coordinates[0] - userLng, 2) + Math.pow(coordinates[1] - userLat, 2)
        ) ?? []

      const i = d.indexOf(Math.min(...d))
      return i ?? 0
    }
    return 0
  })

  const activeStation = ref({} as StationProperties)
  const activeVariable = ref('temp')

  const stationName = computed(() => activeStation.value?.name)
  const timestamp = computed(() => new Date(activeStation.value?.obs?.timestamp ?? Date.now()))

  const dateString = (format = 'MMMM d, yyyy h:00 bbb') => dfFormat(timestamp.value, format)

  const setViewType = (vType: string) => (viewType.value = vType)

  const setValidationTS = (vTS: string) => (validationTS.value = vTS)

  const setActiveVariable = (varName: string) => (activeVariable.value = varName)

  const setActiveStation = (st?: number | string | StationProperties, sts?: StationProperties[]) => {
    if (st) {
      if (typeof st === 'number') {
        activeStation.value =
          data.value?.features?.find(({ properties: { id } }) => id === st)?.properties ?? ({} as StationProperties)
      } else if (typeof st === 'string') {
        activeStation.value =
          data.value?.features?.find(({ properties: { id } }) => id === st)?.properties ?? ({} as StationProperties)
      } else {
        activeStation.value = st
      }
    }
    if (Object.keys(activeStation.value).length === 0) {
      const _sts = sts ?? data.value?.features.map(({ properties }) => properties)
      activeStation.value = _sts?.[closestPointIdx.value] ?? ({} as StationProperties)
    }
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

  watch([viewType, validationTS, dataStatus], () => {
    if (data.value) setActiveStation(activeStation.value.id)
  })

  return {
    viewType,
    data,
    validationTS,
    stationInfo,
    stationConf,
    activeStation,
    activeVariable,
    stationName,
    timestamp,
    metValueStrings,
    dateString,
    getSwatch,
    setViewType,
    setValidationTS,
    setActiveStation,
    setActiveVariable,
  }
})
