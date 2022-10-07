import { z } from 'zod'

export const IP = z.object({
  ip: z.string(),
  city: z.string().optional(),
  region: z.string().optional(),
  country_name: z.string(),
  country_code: z.string().optional(),
  country_capital: z.string(),
  continent_code: z.string(),
  in_eu: z.boolean(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  utc_offset: z.string(),
  country_calling_code: z.string(),
})
