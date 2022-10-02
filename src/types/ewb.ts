import { z } from 'zod'
import {
  DynamicImages as dImgSchema,
  ForecastVariables as fcstSchema,
  ObservationTypes as obsSchema,
} from '@/schemas/ewb'

export type DynamicImages = z.infer<typeof dImgSchema>
export type ForecastVariables = z.infer<typeof fcstSchema>
export type ObservationTypes = z.infer<typeof obsSchema>
