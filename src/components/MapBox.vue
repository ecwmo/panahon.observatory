<template>
  <div class="relative">
    <!-- Map -->
    <div ref="mapEl" class="shadow w-full h-full"></div>

    <div v-if="stationDataIsReady">
      <PulsatingDot v-show="dotProps.show" :xy="dotProps.xy" color="#ffc8c8">
        <Popup class="w-16 -ml-[1.35rem] mb-1 rounded-lg px-0.5 py-1 drop-shadow-lg" :show="dotProps.showPopup">
          <component :is="activeInfo" :data="metValueStrings" class="text-xs text-center" />
        </Popup>
      </PulsatingDot>
      <div
        class="absolute flex justify-between top-2 left-2 bg-white text-black pr-3 py-1 rounded-full drop-shadow-md opacity-90"
      >
        <SwitchGroup>
          <div class="flex items-center px-2 gap-1.5">
            <Switch
              v-model="mapToggle"
              :class="mapToggle ? 'bg-skin-button' : 'bg-skin-button-accent'"
              class="relative inline-flex h-3 w-6 items-center rounded-full transition-colors ring-1 ring-gray-700 ring-offset-1"
              @update:model-value="handleMapScopeChange"
            >
              <span
                :class="mapToggle ? 'translate-x-3 bg-skin-button-accent' : 'bg-skin-button translate-x-0'"
                class="inline-block h-3 w-3 transform rounded-full transition-transform"
              />
            </Switch>
            <SwitchLabel class="text-xs">All Data</SwitchLabel>
          </div>
        </SwitchGroup>
        <MapStationSelector
          v-model="activeStation"
          :stations="visibleStations"
          class="w-32 sm:w-48"
          @update:model-value="handleStationChange"
        />
      </div>
      <div
        class="absolute flex md:hidden justify-between top-2 right-2 bg-white text-black py-1 px-2 text-xs font-semibold rounded-full drop-shadow-md opacity-90"
      >
        {{ stationStore.dateString('d MMM yyyy, h bbb') }}
      </div>

      <WeatherButtons
        :model-value="activeVariable"
        class="right-2 bottom-24 bg-white px-1 py-2.5 drop-shadow-md opacity-90"
        @update:model-value="$emit('update:activeVariable', $event)"
      />
      <Colorbar :name="activeVariable" class="bottom-2 right-2 bg-white p-2 rounded-md drop-shadow-md opacity-90" />
    </div>
    <LoadingIcon v-else class="absolute top-0 left-0 w-full h-full" svg-class="w-16 h-16 text-slate-500" />
  </div>
</template>

<script setup lang="ts">
  import { Map } from 'mapbox-gl'

  import { Station, StationData } from '@/types/station'

  const InfoRain = defineAsyncComponent({ loader: () => import('@/components/info/Rain.vue') })
  const InfoTemp = defineAsyncComponent({ loader: () => import('@/components/info/Temp.vue') })
  const InfoWind = defineAsyncComponent({ loader: () => import('@/components/info/Wind.vue') })
  const InfoPres = defineAsyncComponent({ loader: () => import('@/components/info/Pres.vue') })

  const props = defineProps({
    accessToken: { type: String, required: true },
    activeVariable: { type: String, required: true },
  })

  defineEmits(['update:activeVariable'])

  const map = ref()
  const mapEl = ref()
  const dotProps = ref({ xy: {}, color: undefined, show: false, showPopup: false })
  const mapToggle = ref(false)
  const activeStation = ref()
  const stationStore = useStationStore()

  const { accessToken, activeVariable } = toRefs(props)

  const { data: stationData, isSuccess: stationDataIsReady, metValueString } = useWeather()
  const { data: userPosition, isSuccess: positionIsReady } = useLocation()

  const visibleStations = computed(() => {
    try {
      const mapBounds = map.value.getBounds()
      const { lng: minLon, lat: minLat } = mapBounds.getSouthWest()
      const { lng: maxLon, lat: maxLat } = mapBounds.getNorthEast()

      return (stationData?.value as StationData)?.features
        ?.map(({ properties }) => properties)
        ?.filter(({ lon, lat }) => {
          const validLon = lon >= minLon && lon <= maxLon
          const validLat = lat >= minLat && lat <= maxLat
          return validLon && validLat
        })
        ?.sort(({ id: id1 }, { id: id2 }) => id1 - id2)
    } catch {}
  })

  const activeInfo = computed(() => {
    switch (activeVariable.value) {
      case 'rain':
        return InfoRain
      case 'wind':
        return InfoWind
      case 'pres':
        return InfoPres
      default:
        return InfoTemp
    }
  })

  const metValueStrings = computed(() => {
    const ret: { [k: string]: string } = {}
    const metVars = ['rr', 'rain24h', 'temp', 'hi', 'tx', 'tn', 'wspd', 'wdirStr', 'pres']

    metVars.forEach((v) => {
      ret[v] = metValueString(stationStore.station?.obs, v)
    })

    return ret
  })

  const showPoint = (st: Station) => {
    try {
      const { lat, lon } = st
      const xy = map.value?.project([lon, lat])
      const show = true
      const showPopup = true
      if (xy) dotProps.value = { ...dotProps.value, xy, show, showPopup }
    } catch {}
  }

  const hidePoint = () => {
    const show = false
    const showPopup = false
    dotProps.value = { ...dotProps.value, show, showPopup }
  }

  const getClosestPoint = () => {
    if (stationDataIsReady.value && positionIsReady.value) {
      const { latitude: userLat, longitude: userLng } = userPosition.value
      const d =
        (stationData.value as StationData)?.features?.map(
          ({ geometry: { coordinates } }) =>
            Math.pow(coordinates[0] - userLng, 2) + Math.pow(coordinates[1] - userLat, 2)
        ) ?? []
      const i = d.indexOf(Math.min(...d))
      const newId = stationData.value?.features?.[i].properties?.id ?? 1
      handleStationIdChange(newId)
    } else {
      handleStationIdChange(1)
    }
  }

  const handleStationIdChange = (newId: number) => {
    const newActiveStation = (stationData?.value as StationData)?.features?.find(
      ({ properties: { id } }) => id === newId
    )?.properties
    activeStation.value = newActiveStation
    handleStationChange()
  }

  const handleStationChange = () => {
    stationStore.update(activeStation.value)
    showPoint(activeStation.value as Station)
  }

  const handleMapScopeChange = () => {
    if (mapToggle.value) {
      map.value?.setCenter([121.80434, 12.5549])
      map.value?.setZoom(4.5)
    } else {
      map.value?.setCenter([121.04, 14.56])
      map.value?.setZoom(9.5)
    }
  }

  const loadData = () => {
    if (stationDataIsReady.value) {
      const sourceId = 'station'
      const styleLoadStatus = map.value.isStyleLoaded()
      if (styleLoadStatus) {
        let sourceLoaded = false
        try {
          sourceLoaded = map.value.getSource(sourceId)
        } catch {}
        if (!sourceLoaded) {
          map.value.addSource(sourceId, {
            type: 'geojson',
            data: stationData?.value,
          })

          map.value.addLayer({
            id: 'station-pts',
            type: 'circle',
            source: sourceId,
            paint: {
              'circle-radius': 5,
              'circle-stroke-color': '#000000',
              'circle-stroke-width': 1,
              'circle-color': ['to-color', ['get', activeVariable.value, ['get', 'colors']]],
            },
          })
          getClosestPoint()
        }
      }
    }
  }

  watch([activeVariable], () => {
    const metVars = Object.keys(stationData?.value?.features[0].properties.colors as object)

    if (metVars.indexOf(activeVariable.value) !== -1) {
      map.value.setPaintProperty('station-pts', 'circle-color', [
        'to-color',
        ['get', activeVariable.value, ['get', 'colors']],
      ])
    } else {
      map.value.setPaintProperty('station-pts', 'circle-color', '#ffffff')
    }
  })

  watch([stationDataIsReady, map], () => {
    loadData()
  })

  onMounted(() => {
    map.value = new Map({
      accessToken: accessToken.value,
      container: mapEl.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [121.04, 14.56],
      zoom: 9.5,
      attributionControl: false,
    })

    map.value.once('load', () => {
      loadData()

      map.value.on('click', 'station-pts', (e: StationData) => {
        const {
          properties: { id },
        } = e.features?.[0]
        handleStationIdChange(id)
      })
      // Change the cursor to a pointer when the mouse is over the places layer.
      map.value.on('mouseenter', 'station-pts', () => {
        map.value.getCanvas().style.cursor = 'pointer'
      })
      // Change it back to a pointer when it leaves.
      map.value.on('mouseleave', 'station-pts', () => {
        map.value.getCanvas().style.cursor = ''
      })

      map.value.on('movestart', () => {
        hidePoint()
      })

      map.value.on('moveend', () => {
        showPoint(stationStore.station)
      })
    })
  })
</script>
