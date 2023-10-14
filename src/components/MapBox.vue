<template>
  <div class="relative">
    <!-- Map -->
    <div ref="mapEl" class="shadow w-full h-full"></div>

    <div v-if="stations">
      <PulsatingDot v-show="dotProps.show" :xy="dotProps.xy" color="#ffc8c8">
        <Popup
          v-if="dataViewType === 'default'"
          class="w-16 -ml-[1.35rem] mb-1 rounded-lg px-0.5 py-1 drop-shadow-lg"
          :show="dotProps.showPopup"
        >
          <WeatherPopupInfo :id="activeVariable" :data="metValueStrings" class="text-xs text-center" />
        </Popup>
      </PulsatingDot>
      <div
        class="absolute flex justify-between top-2 left-2 bg-white text-black pr-3 py-1 rounded-full drop-shadow-md opacity-90"
      >
        <SwitchGroup>
          <div class="flex items-center px-2 gap-1.5">
            <Switch
              v-model="mapToggle"
              :class="mapToggle ? 'bg-gray-500' : 'bg-gray-200'"
              class="relative inline-flex h-3 w-6 items-center rounded-full transition-colors ring-1 ring-gray-700 ring-offset-1"
              @update:model-value="handleMapScopeChange"
            >
              <span
                :class="mapToggle ? 'translate-x-3 bg-gray-200' : 'bg-gray-500 translate-x-0'"
                class="inline-block h-3 w-3 transform rounded-full transition-transform"
              />
            </Switch>
            <SwitchLabel class="text-xs">All Data</SwitchLabel>
          </div>
        </SwitchGroup>
        <StationSelector
          :model-value="activeStation"
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
        v-if="dataViewType === 'default'"
        class="right-2 bottom-24 bg-white px-1 py-2.5 drop-shadow-md opacity-90"
      />
      <Colorbar
        v-if="dataViewType === 'default'"
        class="bottom-2 right-2 bg-white p-2 rounded-md drop-shadow-md opacity-90"
      />
    </div>
    <LoadingIcon v-else class="absolute top-0 left-0 w-full h-full" svg-class="w-16 h-16 text-slate-500" />
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { distance, point } from '@turf/turf'
  import { format } from 'date-fns'

  import { stationConfigurations, stationGeoJSON, stationLatestProperties } from '@/schemas/station'
  import { _apiRoute, apiRoute } from '@/stores/routes'

  import { gradientScale, interpHexColor } from '@/lib/color'
  import { geojsonize } from '@/lib/geojson'

  import {
    $activeStation,
    $activeVariable,
    $metValueStrings,
    $timestamp,
    $validationTS,
    $viewType,
    defaultStation,
    setActiveStation,
  } from '@/stores/station'

  import type { StationObsLatest } from '@/types/station'

  const props = defineProps<{
    token: string
  }>()

  interface DotProps {
    xy: {
      x: number
      y: number
    }
    color?: string
    show: boolean
    showPopup: boolean
  }

  let map: mapboxgl.Map
  const mapEl = ref()
  const dotProps = ref<DotProps>({ xy: { x: -1, y: -1 }, show: false, showPopup: false })
  const mapToggle = ref(false)
  const dataViewType = useStore($viewType)
  const activeVariable = useStore($activeVariable)
  const activeStation = useStore($activeStation)
  const dataTimestamp = useStore($timestamp)
  const metValueStrings = useStore($metValueStrings)
  const validationTS = useStore($validationTS)

  const { coords } = useGeolocation()

  const visibleStations = ref<StationObsLatest[]>()

  const visibleStationsSorted = computed(() => {
    const activePt = point([activeStation.value.lon, activeStation.value.lat])

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

  const dataTsString = computed(() => format(dataTimestamp.value, 'd MMM yyyy, h:mm bbb'))

  const showPoint = () => {
    try {
      const { lat, lon } = activeStation.value
      const xy = map.project([lon, lat])
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

  const getVisibleStations = (): StationObsLatest[] | undefined => {
    const mapBnds = map.getBounds()
    if (stations.value) {
      return stations.value.features
        .filter(({ properties: { lon, lat } }) => mapBnds.contains(new mapbox.LngLat(lon, lat)))
        .map(({ properties }) => properties as StationObsLatest)
    }
  }

  const handleStationChange = (st?: number | string | StationObsLatest) => {
    const newStn =
      (typeof st === 'number' || typeof st === 'string' ? visibleStations.value?.find(({ id }) => id === st) : st) ??
      visibleStations.value?.[0] ??
      defaultStation
    setActiveStation(newStn)
    showPoint()
  }

  const handleMapScopeChange = () => {
    if (mapToggle.value) {
      map.setCenter([121.80434, 12.5549])
      map.setZoom(4.5)
    } else {
      map.setCenter([121.04, 14.56])
      map.setZoom(9.5)
    }
  }

  const loadData = () => {
    const sourceId = 'station'
    visibleStations.value = getVisibleStations()
    if (map.isStyleLoaded()) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: stations.value as any,
      })

      map.addLayer({
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
      handleStationChange()
    }
  }

  const { data: gradientFns, isSuccess: gradientFnsReady } = useQuery({
    queryKey: ['stations', 'config'],
    queryFn: async () => {
      const url = _apiRoute('stations/weather_conf')
      const { data } = await axios.get(url)
      const dat = stationConfigurations.parse(data)

      return ['rain', 'temp'].reduce((o, k) => {
        const { palette: { colors, levels } = { colors: ['#ffffff'], levels: [0, 1] } } = dat[k]
        return {
          ...o,
          [k]: gradientScale(colors, levels),
        }
      }, {} as Record<string, chroma.Scale>)
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const fetchStations = async () => {
    const validationTSStr = format(validationTS.value, 'yyyyMMdd') ?? ''
    if (dataViewType.value === 'validation') {
      const url = `${_apiRoute()}/stations/validation/${validationTSStr}`
      const { data } = await axios.get(url)
      return stationGeoJSON.parse(data)
    }
    const url = `${apiRoute()}/observations/latest`
    const { data } = await axios.get(url)
    const dat = stationLatestProperties.array().parse(data)

    const feat = dat.map((d) => {
      const { obs } = d
      const colors = {
        rain: interpHexColor(obs.rainAccum ?? 0, gradientFns.value?.['rain']),
        temp: interpHexColor(obs.temp ?? 0, gradientFns.value?.['temp']),
      }
      return {
        ...d,
        colors,
      }
    })
    return geojsonize(feat, ['obs', 'colors'])
  }

  const { data: stations } = useQuery({
    queryKey: ['stations', dataViewType, validationTS],
    queryFn: fetchStations,
    enabled: gradientFnsReady,
    refetchInterval: 10 * 60 * 1000,
  })

  watch(activeVariable, (newVar) => {
    const metVars = Object.keys(stations.value?.features[0].properties?.colors ?? {})

    if (metVars.indexOf(newVar) !== -1) {
      map.setPaintProperty('station-pts', 'circle-color', ['to-color', ['get', newVar, ['get', 'colors']]])
    } else {
      map.setPaintProperty('station-pts', 'circle-color', '#ffffff')
    }
  })

  watch(closestStn, (newStn) => {
    handleStationChange(newStn)
  })

  onMounted(() => {
    map = new mapbox.Map({
      accessToken: props.token,
      container: mapEl.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [121.04, 14.56],
      zoom: 9.5,
      attributionControl: false,
    })

    map.once('load', () => {
      loadData()
      map.on('click', 'station-pts', (e) => {
        if (e.features) {
          const {
            properties: { id },
          } = e.features[0] as any
          handleStationChange(id)
        }
      })
      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'station-pts', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'station-pts', () => {
        map.getCanvas().style.cursor = ''
      })

      map.on('movestart', () => {
        hidePoint()
      })

      map.on('moveend', () => {
        visibleStations.value = getVisibleStations()
        showPoint()
      })
    })
  })
</script>
