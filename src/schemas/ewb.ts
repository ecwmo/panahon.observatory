import { z } from 'zod'

import { imgSrc } from '@/schemas/common'

export const EWBExtImages = z.object({
  jtwc: imgSrc,
  pagasa: imgSrc,
})

export const EWBIntImages = z.object({
  fcst: z.object({
    rain: imgSrc.array().length(5),
    rainx: imgSrc.array().length(5),
    wind: imgSrc.array().length(5),
    hix: imgSrc.array().length(5),
  }),
  fcstAccum: z.object({
    rain: imgSrc.array().length(3),
    rainx: imgSrc.array().length(3),
  }),
  obs: z.object({
    gsmap: imgSrc.array().length(5),
    gsmapx: imgSrc.array().length(5),
    station: imgSrc.array().length(5),
  }),
})

export const EWBImages = EWBExtImages.merge(EWBIntImages)

export const EWBItems = z
  .object({
    id: z.string(),
    text: z.string(),
  })
  .array()
