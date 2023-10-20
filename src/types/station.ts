import type { FeatureCollection, Geometry } from 'geojson'
import { z } from 'zod'

import { stationObservation, stationObsLatest, stationValidation } from '@/schemas/station'

export type StationObsLatest = z.infer<typeof stationObsLatest>
export type StationValidation = z.infer<typeof stationValidation>
export type StationObs = StationObsLatest | StationValidation

export type Observation = z.infer<typeof stationObservation>

export type StationGeoJSON = FeatureCollection<Geometry, StationObsLatest>

export type ObservationKeys = keyof Observation
