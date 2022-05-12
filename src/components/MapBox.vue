<template>
  <div class="relative">
    <!-- Map -->
    <div ref="mapEl" class="shadow w-full h-full"></div>
    <Dot :xy="dotProps.xy" color="#ffc8c8" />
    <Colorbar :name="activeVariable" />
  </div>
</template>

<script setup lang="ts">
  import { ref, toRefs, onMounted, watch, PropType, computed, defineAsyncComponent } from 'vue'
  import { Map, Point } from 'mapbox-gl'

  import { useLoading } from 'vue-loading-overlay'

  import Colorbar from '@/components/Colorbar.vue'

  import { StationLayer } from '@/scripts/weather'

  const Dot = defineAsyncComponent({ loader: () => import('@/components/PulsatingDot.vue') })

  const props = defineProps({
    accessToken: { type: String, required: true },
    data: { type: Object as PropType<StationLayer>, required: true },
    activeVariable: { type: String, required: true },
    mapScope: { type: String, required: true },
    activeStationId: { type: String },
  })

  const emit = defineEmits(['update:activeStationId'])

  const map = ref()
  const mapEl = ref()
  const dotProps = ref({ xy: <Point>{}, color: undefined })

  const { accessToken, data, activeVariable, mapScope, activeStationId } = toRefs(props)

  const $loading = useLoading()

  const activeStation = computed(
    () =>
      data.value?.features?.find(({ properties: { id } }) => id === activeStationId?.value) ?? {
        properties: { lat: 0, lon: 0 },
      }
  )

  watch([mapScope], () => {
    if (mapScope.value === 'mm') {
      map.value?.setCenter([121.04, 14.56])
      map.value?.setZoom(9.5)
    } else {
      map.value?.setCenter([121.80434, 12.5549])
      map.value?.setZoom(4.5)
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
    const { lat, lon } = activeStation.value.properties
    dotProps.value.xy = map.value.project([lon, lat])
  })

  onMounted(() => {
    const loader = $loading.show({ container: mapEl.value.parentNode, isFullPage: false })

    map.value = new Map({
      accessToken: accessToken.value,
      container: mapEl.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [121.04, 14.56],
      zoom: 9.5,
      attributionControl: false,
    })

    map.value.once('load', () => {
      const { lat, lon } = activeStation.value.properties
      dotProps.value.xy = map.value.project([lon, lat])
      map.value.addSource('station', {
        type: 'geojson',
        data: <any>data.value,
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
      loader.hide()

      map.value.on('click', 'station-pts', ({ features }: StationLayer) => {
        const props = features?.[0].properties
        if (props !== null) {
          emit('update:activeStationId', props.id)
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
    })
  })
</script>
