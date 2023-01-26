import {
  DynamicImages as dImgSchema,
  ForecastAccumVariables as fcstAccumSchema,
  ForecastVariables as fcstSchema,
  ObservationTypes as obsSchema,
} from '@/schemas/ewb'
import { z } from 'zod'

export type DynamicImages = z.infer<typeof dImgSchema>
export type ForecastVariables = z.infer<typeof fcstSchema>
export type ForecastAccumVariables = z.infer<typeof fcstAccumSchema>
export type ObservationTypes = z.infer<typeof obsSchema>
