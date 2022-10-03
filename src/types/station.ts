import { z } from 'zod'

import {
  Station as StationSchema,
  StationProperties as StationPropsSchema,
  ObservationVariables as ObsVarSchema,
} from '@/schemas/station'

export type Station = z.infer<typeof StationSchema>

export type StationProperties = z.infer<typeof StationPropsSchema>

export type ObservationVariables = z.infer<typeof ObsVarSchema>

export type ObservationVariableEnums = keyof ObservationVariables
