import { Feature, Geometry, GeoJsonProperties } from 'geojson'

import { getColor } from '@/scripts/color'

interface StationInfo {
  name: string
  lat: number
  lon: number
  elevation?: number
  address?: string
}

interface StationObs {
  [key: string]: any
}

interface RawStationLayer {
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

const getMetValue = (stnObs: StationObs, varName: string) => {
  if (['rr', 'rain24h', 'pres'].indexOf(varName) !== -1) {
    return stnObs[varName] ? (<number>stnObs[varName]).toFixed() : '--'
  } else if (varName === 'wdirStr') {
    return windDirDeg2Str(<number>stnObs[varName])
  } else {
    return stnObs[varName] ? (<number>stnObs[varName]).toFixed(1) : '--'
  }
}

const dropInactiveStations = (stnLyr: { [index: string]: StationInfo }, validIds: string[]) => {
  return Object.keys(stnLyr)
    .filter((k) => validIds.includes(k))
    .reduce((o: { [index: string]: StationInfo }, k) => {
      o[k] = stnLyr[k]
      return o
    }, {})
}

const formatStnLayer = (stnLyr: RawStationLayer, stationObs: { [index: string]: StationObs }) => {
  const stationIds = Object.keys(stationObs)
  const filteredStnLyr = dropInactiveStations(stnLyr, stationIds)

  let newStnLyr = <StationLayer>{
    type: 'FeatureCollection',
    features: Object.keys(filteredStnLyr).map((k) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [filteredStnLyr[k].lon, filteredStnLyr[k].lat],
      },
      properties: { id: k, ...filteredStnLyr[k], obs: stationObs[k] },
    })),
  }

  Object.keys(metVars).forEach((varName) => {
    newStnLyr = setPtColor(newStnLyr, varName)
  })

  return newStnLyr
}

const setPtColor = (lyr: StationLayer, varName: string) => {
  const { features } = lyr
  if (Object.keys(metVars).indexOf(varName) !== -1) {
    const newFeats = features.map((f) => {
      const { properties: props } = f
      let colors = {}.hasOwnProperty.call(props, 'colors') ? props['colors'] : {}
      let _varName = varName === 'rain' ? 'rain24h' : varName
      if (!{}.hasOwnProperty.call(colors, varName)) {
        let val = props['obs'][_varName]
        const _val = (val - metVars[varName].range.min) / (metVars[varName].range.max - metVars[varName].range.min)
        colors = { ...colors, [varName]: getColor(_val, varName) }
        props['colors'] = colors
      }
      return { ...f, properties: props }
    })
    return { ...lyr, features: newFeats }
  }
  return lyr
}

export { StationLayer, metVars, formatStnLayer, windDirDeg2Str, getMetValue }
