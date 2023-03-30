<template>
  <div class="relative">
    <!-- Map -->
    <div ref="mapEl" class="shadow w-full h-full"></div>

    <div v-if="$station">
      <PulsatingDot v-show="dotProps.show" :xy="dotProps.xy" color="#ffc8c8">
        <Popup
          v-if="$dataViewType === 'default'"
          class="w-16 -ml-[1.35rem] mb-1 rounded-lg px-0.5 py-1 drop-shadow-lg"
          :show="dotProps.showPopup"
        >
          <WeatherPopupInfo :id="$activeVariable" :data="$metValueStrings" class="text-xs text-center" />
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
        <StationSelector
          :model-value="$activeStation"
          :stations="visibleStationsSorted"
          class="w-32 sm:w-48"
          @update:model-value="handleStationChange"
        />
      </div>
      <div
        class="absolute flex md:hidden justify-between top-2 right-2 bg-white text-black py-1 px-2 text-xs font-semibold rounded-full drop-shadow-md opacity-90"
      >
        {{ dataTsString }}
      </div>

      <WeatherButtons
        v-if="$dataViewType === 'default'"
        class="right-2 bottom-24 bg-white px-1 py-2.5 drop-shadow-md opacity-90"
      />
      <Colorbar
        v-if="$dataViewType === 'default'"
        class="bottom-2 right-2 bg-white p-2 rounded-md drop-shadow-md opacity-90"
      />
    </div>
    <LoadingIcon v-else class="absolute top-0 left-0 w-full h-full" svg-class="w-16 h-16 text-slate-500" />
  </div>
</template>

<script setup lang="ts">
  import { useStore, useVModel } from '@nanostores/vue'
  import { distance, point } from '@turf/turf'
  import { format } from 'date-fns'
  import mapbox from 'mapbox-gl'

  import {
    activeStation,
    activeVariable,
    metValueStrings,
    setActiveStation,
    station,
    timestamp,
    viewType,
  } from '@/stores/station'

  import type { Station, StationProperties } from '@/types/station'

  const { LngLat, Map } = mapbox

  interface Props {
    token: string
  }
  const props = defineProps<Props>()

  const map = ref()
  const mapEl = ref()
  const dotProps = ref({ xy: {}, color: undefined, show: false, showPopup: false })
  const mapToggle = ref(false)
  const $dataViewType = useStore(viewType)
  const $station = useStore(station)
  const $activeVariable = useStore(activeVariable)
  const $activeStation = useVModel(activeStation)
  const $dataTimestamp = useStore(timestamp)
  const $metValueStrings = useStore(metValueStrings)

  const { coords } = useGeolocation()

  const visibleStations = computed(() => {
    let vStations = $station.value
    try {
      const mapBnds = map.value.getBounds()
      if (vStations)
        vStations = {
          ...vStations,
          features: vStations?.features?.filter(({ properties: { lon, lat } }) =>
            mapBnds.contains(new LngLat(lon, lat))
          ),
        }
    } catch {}

    return vStations?.features?.map(({ properties }) => properties)
  })

  const visibleStationsSorted = computed(() => {
    const activePt = point([$activeStation.value.lon ?? 0, $activeStation.value.lat ?? 0])

    return visibleStations.value
      ?.map((props) => ({ ...props, dist: distance({ type: 'Point', coordinates: [props.lon, props.lat] }, activePt) }))
      ?.sort(({ dist: d1 }, { dist: d2 }) => (d1 && d2 ? d1 - d2 : 0))
  })

  const closestStn = computed(() => {
    let idx = 0

    if (coords.value) {
      const { latitude: userLat, longitude: userLng } = coords.value

      const d =
        visibleStations.value?.map(({ lat, lon }) => Math.pow(lon - userLng, 2) + Math.pow(lat - userLat, 2)) ?? []

      idx = d.indexOf(Math.min(...d))
      if (idx === -1) idx = 0
    }

    return visibleStations.value?.[idx]
  })

  const dataTsString = computed(() => format($dataTimestamp.value, 'd MMM yyyy, h bbb'))

  const showPoint = () => {
    try {
      const { lat, lon } = $activeStation.value
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

  const handleStationChange = (st?: number | string | StationProperties) => {
    setActiveStation(visibleStations.value, st ?? closestStn.value)
    showPoint()
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
          data: $station.value,
        })

        map.value.addLayer({
          id: 'station-pts',
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': 5,
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 1,
            'circle-color': ['to-color', ['get', $activeVariable.value, ['get', 'colors']]],
          },
        })
        handleStationChange()
      }
    }
  }

  watch($activeVariable, (newVar) => {
    const metVars = Object.keys($station.value?.features[0].properties.colors ?? {})

    if (metVars.indexOf(newVar) !== -1) {
      map.value.setPaintProperty('station-pts', 'circle-color', ['to-color', ['get', newVar, ['get', 'colors']]])
    } else {
      map.value.setPaintProperty('station-pts', 'circle-color', '#ffffff')
    }
  })

  watch(closestStn, (newStn) => {
    handleStationChange(newStn)
  })

  onMounted(() => {
    map.value = new Map({
      accessToken: props.token,
      container: mapEl.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [121.04, 14.56],
      zoom: 9.5,
      attributionControl: false,
    })

    map.value.once('load', () => {
      loadData()
      map.value.on('click', 'station-pts', (e: Station) => {
        const {
          properties: { id },
        } = e.features?.[0]
        handleStationChange(id)
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
        showPoint()
      })
    })
  })
</script>
