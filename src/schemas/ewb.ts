import { z } from 'zod'

import { imgSrc } from '@/schemas/common'

export const ExternalImages = z.object({
  jtwc: imgSrc,
  pagasa: imgSrc,
})

export const DynamicImages = z.object({
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

export const Images = ExternalImages.merge(DynamicImages)

export const ForecastVariables = z
  .object({
    id: DynamicImages.shape.fcst.keyof(),
    text: z.string(),
  })
  .array()

export const ForecastAccumVariables = z
  .object({
    id: DynamicImages.shape.fcstAccum.keyof(),
    text: z.string(),
  })
  .array()

export const ObservationTypes = z
  .object({
    id: DynamicImages.shape.obs.keyof(),
    text: z.string(),
  })
  .array()
