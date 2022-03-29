import { Geometry, GeoJsonProperties } from 'geojson'

import { getColor } from '@/scripts/color'

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

type StationLayer = {
  type: string
  features: {
    type: string
    geometry: Geometry
    properties: StationGeoJsonProperties
  }[]
}

interface MetVariables {
  [key: string]: {
    name: string
    units: string
    range: {
      min: number
      max: number
    }
  }
}

const metVars: MetVariables = {
  rain: {
    name: 'Rainfall',
    units: 'mm',
    range: {
      min: 0,
      max: 25,
    },
  },
  temp: {
    name: 'Temperature',
    units: '°C',
    range: {
      min: 25,
      max: 35,
    },
  },
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

const formatStnLayer = (stnLyr: RawStationData) =>
  <StationLayer>{
    type: 'FeatureCollection',
    features: Object.keys(stnLyr)
      .map((k) => {
        const props = stnLyr[k]
        const { obs } = props
        const colors: GeoJsonProperties = {}
        Object.keys(metVars).forEach((varName) => {
          let val = varName === 'rain' ? obs['rain24h'] : obs[varName]
          const _val = (val - metVars[varName].range.min) / (metVars[varName].range.max - metVars[varName].range.min)
          colors[varName] = getColor(_val, varName)
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

export { StationLayer, metVars, formatStnLayer, windDirDeg2Str, metValueString }
