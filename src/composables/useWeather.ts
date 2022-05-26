import axios from 'axios'
import { getMinutes, getSeconds, getMilliseconds } from 'date-fns'
import { useQuery } from 'vue-query'

import { Point, GeoJsonProperties, FeatureCollection } from 'geojson'

interface StationObs {
  [key: string]: any
}

export type StationGeoJsonProperties = GeoJsonProperties & {
  id: number
  obs: { [key: string]: any }
  colors?: { [key: string]: string }
}

export type StationLayer = FeatureCollection<Point, StationGeoJsonProperties>

export default () => {
  const { formatDate } = useDate()

  const fetchData = async (timestamp: string) => {
    const { data } = await axios.get(`/api/stations.php?ts=${timestamp}`)
    return <StationLayer>data
  }

  const stationDataTimestamp = computed(() => formatDate('yyyyMMddHH'))

  const stationDataStaleTime = computed(() => {
    const curDate = new Date()
    const hourInMs = 60 * 60 * 1000
    const numMs = (getMinutes(curDate) * 60 + getSeconds(curDate)) * 1000 + getMilliseconds(curDate)
    return hourInMs - numMs
  })

  const stationDataQuery = useQuery(
    ['stationData', stationDataTimestamp],
    () => {
      return fetchData(stationDataTimestamp.value)
    },
    {
      staleTime: stationDataStaleTime,
    }
  )

  const { data: weatherConf } = useQuery(
    'weatherConf',
    async () => {
      const { data } = await axios.get('/api/stations.php?weather_conf')
      return data
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  )

  const metValueString = (stnObs: StationObs, varName: string) => {
    let fracDigits = 1
    const val: number = stnObs?.[varName] ?? -999
    if (varName === 'wdirStr') {
      return windDirDeg2Str(stnObs?.['wdir'])
    }
    if (!dataIsValid(val, varName)) return '--'
    if (['rr', 'rain24h', 'pres'].indexOf(varName) !== -1) {
      fracDigits = 0
    }
    return val.toFixed(fracDigits)
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

  const dataIsValid = (val: number, varName: string) => {
    if (varName === 'pres') return val !== -999
    if (varName === 'wdir') return val >= 0 && val <= 360
    return ![999.9, -999].includes(val)
  }

  const getSwatch = (varName: string) => {
    const { colors, levels } = weatherConf.value?.[varName]?.palette ?? { colors: [], levels: [] }

    return { colors, levels }
  }

  return {
    ...stationDataQuery,
    weatherConf,
    windDirDeg2Str,
    metValueString,
    getSwatch,
  }
}
