import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

type Properties = {
  id: number
  name: string
  lat: number
  lon: number
} & GeoJsonProperties

export const geojsonize = <T extends Properties, K extends keyof T>(
  dat: T[],
  props: K[]
): FeatureCollection<Geometry, Properties> => {
  const features = dat.map((d): Feature<Geometry, Properties> => {
    const { id, name, lat, lon } = d
    const geometry: Geometry = {
      type: 'Point',
      coordinates: [lon, lat],
    }
    const properties = props.reduce<Properties>(
      (o, c) => ({
        ...o,
        [c]: d[c],
      }),
      { id, name, lat, lon }
    )
    return {
      type: 'Feature',
      geometry,
      properties,
    }
  })
  return {
    type: 'FeatureCollection',
    features,
  }
}
