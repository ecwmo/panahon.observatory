import { z } from 'zod'

import { imgSrc } from '@/schemas/common'

const imgSrcArr = imgSrc.array().length(5)

export const ExternalImages = z.object({
  jtwc: imgSrc,
  pagasa: imgSrc,
})

export const DynamicImages = z.object({
  fcst: z.object({
    rain: imgSrcArr,
    rainx: imgSrcArr,
    wind: imgSrcArr,
    hix: imgSrcArr,
  }),
  obs: z.object({
    gsmap: imgSrcArr,
    station: imgSrcArr,
  }),
})

export const Images = ExternalImages.merge(DynamicImages)

export const ForecastVariables = z
  .object({
    id: DynamicImages.shape.fcst.keyof(),
    text: z.string(),
  })
  .array()

export const ObservationTypes = z
  .object({
    id: DynamicImages.shape.obs.keyof(),
    text: z.string(),
  })
  .array()
