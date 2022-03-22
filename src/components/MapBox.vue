<template>
  <div class="relative">
    <!-- Map -->
    <div ref="mapEl" class="shadow w-full h-full"></div>
    <Colorbar :name="activeVariable" />
  </div>
</template>

<script lang="ts">
  import { ref, toRefs, onMounted, defineComponent, watch, PropType, computed } from 'vue'
  import mapboxgl, { Map } from 'mapbox-gl'
  import axios from 'axios'

  import Colorbar from '@/components/Colorbar.vue'

  import { StationLayer } from '@/scripts/weather'

  export default defineComponent({
    props: {
      data: { type: Object as PropType<StationLayer>, required: true },
      activeVariable: { type: String, required: true },
      mapScope: { type: String, required: true },
      activeStationId: { type: String },
      visibleStations: { type: Object as PropType<StationLayer['features']>, default: [{ properties: { id: '' } }] },
      loaded: { type: Boolean, default: false },
    },
    emits: ['update:activeStationId', 'update:visibleStations', 'update:loaded'],
    components: { Colorbar },
    setup(props, { emit }) {
      const mapEl = ref()
      const map = ref()

      const { data, activeVariable, mapScope, activeStationId, visibleStations } = toRefs(props)

      const activeStation = computed(() => {
        if (data.value && data.value.features) {
          const st = data.value.features.find(({ properties: { id } }) => id === activeStationId.value)
          if (st) return st
        }
        return { properties: { lat: 0, lon: 0 } }
      })

      watch([mapScope], () => {
        if (map.value) {
          if (mapScope.value === 'mm') {
            map.value.setCenter([121.04, 14.56])
            map.value.setZoom(9.5)
          } else {
            map.value.setCenter([121.80434, 12.5549])
            map.value.setZoom(4.5)
          }
        }
      })

      watch([activeVariable], () => {
        const metVars = Object.keys(<Object>data.value.features[0].properties.colors)

        if (metVars.indexOf(activeVariable.value) !== -1) {
          map.value.setPaintProperty('station-pts', 'circle-color', [
            'to-color',
            ['get', activeVariable.value, ['get', 'colors']],
          ])
        } else {
          map.value.setPaintProperty('station-pts', 'circle-color', '#ffffff')
        }
      })

      watch([activeStationId], () => {
        const dotPt = map.value ? map.value.getSource('active-point') : null
        const { lat, lon } = activeStation.value.properties
        if (dotPt) {
          dotPt.setData({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [lon, lat], // icon position [lng, lat]
                },
              },
            ],
          })
        }
      })

      onMounted(async () => {
        const tok = await axios.post('api/env.php', { token: 'mapbox' }).then(({ data: tok }) => tok)
        mapboxgl.accessToken = tok

        const dotSize = 100
        // This implements `StyleImageInterface`
        // to draw a pulsing dot icon on the map.
        const pulsingDot = {
          width: dotSize,
          height: dotSize,
          data: new Uint8Array(dotSize * dotSize * 4),

          // When the layer is added to the map,
          // get the rendering context for the map canvas.
          onAdd: function () {
            const canvas = document.createElement('canvas')
            canvas.width = this.width
            canvas.height = this.height
            // @ts-ignore
            this.context = canvas.getContext('2d')
          },

          // Call once before every frame where the icon will be used.
          render: function () {
            const duration = 1600
            const t = (performance.now() % duration) / duration

            const radius = (dotSize / 2) * 0.3
            const outerRadius = (dotSize / 2) * 0.7 * t + radius
            // @ts-ignore
            const context = this.context

            // Draw the outer circle.
            context.clearRect(0, 0, this.width, this.height)
            context.beginPath()
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
            context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')'
            context.fill()

            // Draw the inner circle.
            context.beginPath()
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
            context.fillStyle = 'rgba(255, 100, 100, 0)'
            context.strokeStyle = 'white'
            context.lineWidth = 2 + 4 * (1 - t)
            context.fill()
            context.stroke()

            // Update this image's data with data from the canvas.
            this.data = context.getImageData(0, 0, this.width, this.height).data

            // Continuously repaint the map, resulting
            // in the smooth animation of the dot.
            map.value.triggerRepaint()

            // Return `true` to let the map know that the image was updated.
            return true
          },
        }
        const { lat, lon } = activeStation.value.properties

        map.value = new Map({
          container: mapEl.value,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [121.04, 14.56],
          zoom: 9.5,
          attributionControl: false,
        })

        map.value.once('load', () => {
          emit('update:loaded', true)
          map.value.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })
          map.value.addSource('station', {
            type: 'geojson',
            data: data.value,
          })
          map.value.addLayer({
            id: 'station-pts',
            type: 'circle',
            source: 'station',
            paint: {
              'circle-radius': 5,
              'circle-stroke-color': '#000000',
              'circle-stroke-width': 1,
              'circle-color': ['to-color', ['get', activeVariable.value, ['get', 'colors']]],
            },
          })
          map.value.addSource('active-point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [lon, lat], // icon position [lng, lat]
                  },
                  properties: [],
                },
              ],
            },
          })
          map.value.addLayer({
            id: 'layer-with-pulsing-dot',
            type: 'symbol',
            source: 'active-point',
            layout: {
              'icon-image': 'pulsing-dot',
            },
          })
          map.value.on('click', 'station-pts', ({ features }: StationLayer) => {
            if (features !== undefined) {
              const { properties: props } = features[0]
              if (props !== null) {
                emit('update:activeStationId', props.id)
              }
            }
          })
          // Change the cursor to a pointer when the mouse is over the places layer.
          map.value.on('mouseenter', 'station-pts', () => {
            map.value.getCanvas().style.cursor = 'pointer'
          })
          // Change it back to a pointer when it leaves.
          map.value.on('mouseleave', 'station-pts', () => {
            map.value.getCanvas().style.cursor = ''
          })
          map.value.on('zoomend', () => {
            const _visibleStations = <StationLayer['features']>map.value.queryRenderedFeatures({
              layers: ['station-pts'],
            })
            const curIds = visibleStations.value.map(({ properties: { id } }) => id)
            const newIds = _visibleStations.map(({ properties: { id } }) => id)

            if (curIds.sort().join(',') !== newIds.sort().join(',')) {
              emit(
                'update:visibleStations',
                data.value.features.filter(
                  ({ properties: { id } }) => [...newIds, activeStationId.value].indexOf(id) !== -1
                )
              )
            }
          })
        })
      })

      return { mapEl }
    },
  })
</script>
