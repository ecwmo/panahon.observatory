import type { FeatureCollection, Geometry } from 'geojson'
import { z } from 'zod'

import { observationProperties, stationLatestProperties } from '@/schemas/station'

export type StationObsLatest = z.infer<typeof stationLatestProperties>

export type Observation = z.infer<typeof observationProperties>

export type StationGeoJSON = FeatureCollection<Geometry, StationObsLatest>

export type ObservationKeys = keyof Observation
