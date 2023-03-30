import { FeatureCollection, Geometry } from 'geojson'
import { z } from 'zod'

import { ObservationVariables as ObsVarSchema, StationProperties as StationPropsSchema } from '@/schemas/station'

export type Station = FeatureCollection<Geometry, StationProperties>

export type StationProperties = z.infer<typeof StationPropsSchema>

export type ObservationVariables = z.infer<typeof ObsVarSchema>

export type ObservationVariableEnums = keyof ObservationVariables
