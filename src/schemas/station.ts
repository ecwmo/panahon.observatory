import { z } from 'zod'

import { camelize } from '@/schemas/common'

export const stationObservation = z
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

const stringID = z.object({ id: z.string() })
const numberID = z.object({ id: z.number() })

export const station = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  elevation: z.number().nullish(),
  address: z.string().nullish(),
})

export const stationObsLatest = station.merge(numberID).merge(z.object({ obs: stationObservation }))
export const stationValidation = station.merge(stringID).merge(z.object({ tsImg: z.string().optional() }))

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
