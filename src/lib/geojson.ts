import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

type Properties = {
  id: number | string
  name: string
  lat: number
  lon: number
} & GeoJsonProperties

export const geojsonize = <T extends Properties>(
  dat: T[],
  props: string[]
): FeatureCollection<Geometry, Properties> => {
  const features = dat.map((d): Feature<Geometry, Properties> => {
    const { id, name, lat, lon } = d
    const geometry: Geometry = {
      type: 'Point',
      coordinates: [lon, lat],
    }
    const properties = props.reduce<Properties>(
      (o, c) => {
        if (c in d) {
          return {
            ...o,
            [c]: d[c],
          }
        }
        return o
      },
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
