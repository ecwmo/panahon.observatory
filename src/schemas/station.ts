import { z } from 'zod'

import { camelize } from '@/schemas/common'

export const observationProperties = z
  .object({
    rain: z.number().nullish(),
    temp: z.number().nullish(),
    rh: z.number().nullish(),
    wdir: z.number().nullish(),
    wspd: z.number().nullish(),
    srad: z.number().nullish(),
    mslp: z.number().nullish(),
    tn: z.number().nullish(),
    tx: z.number().nullish(),
    hi: z.number().nullish(),
    gust: z.number().nullish(),
    rain_accum: z.number().nullish(),
    tn_timestamp: z.string().nullish(),
    tx_timestamp: z.string().nullish(),
    gust_timestamp: z.string().nullish(),
    timestamp: z.string().nullish(),
  })
  .transform(camelize)

const observationColorProperties = z.object({
  rain: z.string().length(7),
  temp: z.string().length(7),
})

export const stationLatestProperties = z.object({
  id: z.number(),
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  elevation: z.number().nullish(),
  address: z.string().nullish(),
  obs: observationProperties,
  colors: observationColorProperties.optional(),
  tsImg: z.string().optional(),
})

const stationGeom = z.object({
  type: z.enum(['Point']),
  coordinates: z.number().array().length(2),
})

const stationFeature = z.object({
  type: z.enum(['Feature']),
  geometry: stationGeom,
  properties: stationLatestProperties,
})

export const stationGeoJSON = z.object({
  type: z.enum(['FeatureCollection']),
  features: stationFeature.array(),
})

const stationConfiguration = z.object({
  varName: z.string().optional(),
  desc: z.string(),
  units: z.string(),
  palette: z
    .object({
      name: z.string(),
      vmin: z.number(),
      vmax: z.number(),
      n: z.number(),
      levels: z.number().array(),
      colors: z.string().length(7).array(),
    })
    .optional(),
})

export const stationConfigurations = z.record(stationConfiguration)
