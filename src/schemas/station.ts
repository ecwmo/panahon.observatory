import { z } from 'zod'

export const ObservationVariables = z.object({
  rr: z.number().nullable().optional(),
  temp: z.number().nullable().optional(),
  hi: z.number().nullable().optional(),
  wspd: z.number().nullable().optional(),
  wdir: z.number().nullable().optional(),
  pres: z.number().nullable().optional(),
  rh: z.number().nullable().optional(),
  td: z.number().nullable().optional(),
  srad: z.number().nullable().optional(),
  rain24h: z.number().nullable().optional(),
  tx: z.number().nullable().optional(),
  tn: z.number().nullable().optional(),
  timestamp: z.string(),
})

const ObservationVariableColors = z.object({
  rain: z.string().length(7),
  temp: z.string().length(7),
})

export const StationProperties = z.object({
  id: z.number(),
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  elevation: z.number(),
  address: z.union([z.string(), z.number()]),
  obs: ObservationVariables.optional(),
  colors: ObservationVariableColors.optional(),
})

const StationLocation = z.object({
  type: z.enum(['Point']),
  coordinates: z.number().array().length(2),
})

const StationFeature = z.object({
  type: z.enum(['Feature']),
  geometry: StationLocation,
  properties: StationProperties,
})

export const Station = z.object({
  type: z.enum(['FeatureCollection']),
  features: StationFeature.array(),
})

const StationConfiguration = z.object({
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

export const StationConfigurations = z.record(StationConfiguration)
