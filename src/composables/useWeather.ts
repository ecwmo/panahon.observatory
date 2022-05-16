import axios from 'axios'
import { useQuery } from 'vue-query'

import { Geometry, GeoJsonProperties } from 'geojson'

type StationObs = {
  [key: string]: any
}

type StationGeoJsonProperties = GeoJsonProperties & {
  id: number
  obs: StationObs
  colors?: { [key: string]: string }
}

export type StationLayer = {
  type: string
  features: {
    type: string
    geometry: Geometry
    properties: StationGeoJsonProperties
  }[]
}

export default () => {
  const fetchData = () => axios.get('/api/stations.php').then(({ data }) => <StationLayer>data)

  const { data: weatherConf } = useQuery('weatherConf', () =>
    axios.get('/api/stations.php?weather_conf').then(({ data }) => data)
  )

  const metValueString = (stnObs: StationObs, varName: string) => {
    if (!stnObs || Object.keys(stnObs).length === 0) return '--'
    let val: number = stnObs[varName]
    if (['rr', 'rain24h', 'pres'].indexOf(varName) !== -1) {
      return dataIsValid(val, varName) ? val.toFixed() : '--'
    } else if (varName === 'wdirStr') {
      val = stnObs['wdir']
      return windDirDeg2Str(val)
    } else {
      return dataIsValid(val, varName) ? val.toFixed(1) : '--'
    }
  }

  const windDirDeg2Str = (val: number) => {
    if (val === null || val < 0) return ''
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

  const dataIsValid = (val: any, varName: string) => {
    if (varName === 'pres') return val !== -999
    return ![999.9, -999].includes(val)
  }

  const getSwatch = (varName: string) => {
    const { colors, levels } = weatherConf.value[varName]?.palette ?? { colors: [], levels: [] }

    return { colors, levels }
  }

  return {
    ...useQuery('stationData', fetchData),
    weatherConf,
    windDirDeg2Str,
    metValueString,
    getSwatch,
  }
}
