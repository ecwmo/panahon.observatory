import { Point, FeatureCollection } from 'geojson'
import { GenericObject, StringObject } from '@/types/common'

export type Station = GenericObject & {
  id: number
  obs: GenericObject
  colors?: StringObject
}

export type StationData = FeatureCollection<Point, Station>
