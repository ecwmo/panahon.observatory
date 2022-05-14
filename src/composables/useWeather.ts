import axios from 'axios'
import { useQuery } from 'vue-query'

import { Geometry, GeoJsonProperties } from 'geojson'

type StationObs = {
  [key: string]: any
}

type StationInfo = GeoJsonProperties & {
  name: string
  lat: number
  lon: number
  elevation?: number
  address?: string
  obs: StationObs
}

type RawStationData = {
  [key: string]: StationInfo
}

type StationGeoJsonProperties = GeoJsonProperties & {
  id: string
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

export interface WeatherVariables {
  [key: string]: {
    name: string
    units: string
    range?: {
      min: number
      max: number
    }
    gradient?: { val: number; rgb: number[] }[]
  }
}

const weatherVariables: WeatherVariables = {
  rain: {
    name: 'Rainfall',
    units: 'mm',
    range: {
      min: 0,
      max: 25,
    },
    gradient: [
      { val: 0, rgb: [245, 245, 245] },
      { val: 0.2, rgb: [199, 234, 229] },
      { val: 0.4, rgb: [128, 205, 193] },
      { val: 0.6, rgb: [53, 151, 143] },
      { val: 0.8, rgb: [1, 102, 94] },
      { val: 1, rgb: [0, 60, 48] },
    ],
  },
  temp: {
    name: 'Temperature',
    units: '°C',
    range: {
      min: 25,
      max: 35,
    },
    gradient: [
      { val: 0, rgb: [247, 247, 247] },
      { val: 0.2, rgb: [253, 219, 199] },
      { val: 0.4, rgb: [244, 165, 130] },
      { val: 0.6, rgb: [214, 96, 77] },
      { val: 0.8, rgb: [178, 24, 43] },
      { val: 1, rgb: [103, 0, 31] },
    ],
  },
  wind: {
    name: 'Wind',
    units: 'm/s',
  },
  pres: {
    name: 'Pressure',
    units: 'hPa',
  },
}

export default () => {
  const fetchData = () => axios.get('/api/stations.php').then(({ data }) => formatStnLayer(data))

  const formatStnLayer = (stnLyr: RawStationData) =>
    <StationLayer>{
      type: 'FeatureCollection',
      features: Object.keys(stnLyr)
        .map((k) => {
          const props = stnLyr[k]
          const { obs } = props
          const colors: GeoJsonProperties = {}
          Object.keys(weatherVariables).forEach((varName) => {
            let val = varName === 'rain' ? obs['rain24h'] : obs[varName]
            const { min, max } = weatherVariables[varName]?.range ?? { min: 0, max: 0 }
            if (min !== max) {
              const _val = (val - min) / (max - min)
              colors[varName] = getColor(_val, varName)
            }
          })

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [props.lon, props.lat],
            },
            properties: { id: k, ...props, colors },
          }
        })
        .filter(({ properties: { name } }) => name !== undefined),
    }

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

  const getGradient = (varName: string) => weatherVariables[varName]?.gradient ?? []

  const rgbToHex = (rgb: number[]) =>
    '#' +
    rgb
      .map((c: number) => {
        let hex = c.toString(16)
        return hex.length == 1 ? '0' + hex : hex
      })
      .join('')

  const getColor = (val: number, varName: string) => {
    const gradient = getGradient(varName)
    let rgb = gradient.length > 0 ? gradient[gradient.length - 1].rgb : [0, 0, 0]

    if (val === null) return ''

    gradient.every((g) => {
      if (val <= g.val) {
        rgb = g.rgb
        return false
      }

      return true
    })

    return rgbToHex(rgb)
  }

  const getSwatch = (varName: string) => {
    const gradient = getGradient(varName)
    if (gradient.length) {
      const { min, max } = weatherVariables[varName]?.range ?? { min: 0, max: 0 }

      return gradient.map((g) => {
        const label = min + +((max - min) * g.val).toFixed()
        return {
          color: rgbToHex(g.rgb),
          label,
        }
      })
    }
  }

  return { ...useQuery('stationData', fetchData), weatherVariables, windDirDeg2Str, metValueString, getSwatch }
}
