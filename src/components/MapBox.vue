<template>
  <div class="relative">
    <!-- Map -->
    <div ref="mapEl" class="shadow w-full h-full"></div>

    <LoadingIcon v-if="isPending" class="absolute top-0 left-0 w-full h-full" svg-class="w-16 h-16 text-slate-500" />
    <div v-else-if="isSuccess">
      <PulsatingDot v-show="dotProps.show" :xy="dotProps.xy" color="#ffc8c8">
        <Popup
          v-if="dataViewType === 'default'"
          class="w-16 -ml-[1.35rem] mb-1 rounded-lg px-0.5 py-1 drop-shadow-lg"
          :show="dotProps.showPopup"
        >
          <WeatherPopupInfo :id="activeVariable" :data="activeStationObsStr" class="text-xs text-center" />
        </Popup>
      </PulsatingDot>
      <div
        v-show="visibleStationsSorted"
        class="absolute flex justify-between top-2 left-2 bg-white text-black pr-3 py-1 rounded-full drop-shadow-md opacity-90"
      >
        <!-- bar at top left of map -->
        <div class="flex items-center px-2 gap-1.5">
          <SwitchRoot
            v-model="mapToggle"
            class="w-6 h-4 shadow-sm flex data-[state=unchecked]:bg-blue-300 data-[state=checked]:bg-blue-500 border border-gray-800 data-[state=checked]:border-blue-500 rounded-full relative transition-[background] focus-within:outline-none focus-within:border-blue-600 focus-within:shadow-blue-600"
            @update:model-value="handleMapScopeChange"
          >
            <SwitchThumb
              class="w-2.5 h-2.5 my-auto bg-white text-xs flex items-center justify-center shadow-xl rounded-full transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-full"
            />
          </SwitchRoot>
          <label class="text-xs">All Data</label>
        </div>

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
        {{ activeStationTsStr }}
      </div>

      <WeatherButtons
        v-if="dataViewType === 'default'"
        class="right-2 bottom-24 bg-white px-1 py-2.5 drop-shadow-md opacity-90"
      />
      <!-- container for buttons at bottom right -->
      <Colorbar
        v-if="dataViewType === 'default'"
        class="bottom-2 right-2 bg-white p-2 rounded-md drop-shadow-md opacity-90"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import 'mapbox-gl/dist/mapbox-gl.css'

  import { useStore } from '@nanostores/vue'
  import { format } from 'date-fns'
  import mapboxgl from 'mapbox-gl'
  import { ref, computed, shallowRef, watch, onMounted, onUnmounted } from 'vue'

  import { useWeather } from '@/composables/weather'
  import {
    $activeStation,
    $activeStationObsStr,
    $activeStationTs,
    $activeVariable,
    $viewType,
    defaultStation,
    setActiveStation,
  } from '@/stores/station'

  import { SwitchRoot, SwitchThumb } from 'reka-ui'

  import Colorbar from '@/components/Colorbar.vue'
  import LoadingIcon from '@/components/LoadingIcon.vue'
  import Popup from '@/components/Popup.vue'
  import PulsatingDot from '@/components/PulsatingDot.vue'
  import StationSelector from '@/components/StationSelector.vue'
  import WeatherButtons from '@/components/WeatherButtons.vue'
  import WeatherPopupInfo from '@/components/WeatherPopupInfo.vue'

  import type { Map } from 'mapbox-gl'
  import type { StationObs } from '@/types/station'

  const { LngLat } = mapboxgl

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

  const map = shallowRef<Map>()
  const mapEl = ref()
  const dotProps = ref<DotProps>({ xy: { x: -1, y: -1 }, show: false, showPopup: false })
  const mapToggle = ref(false)
  const dataViewType = useStore($viewType)
  const activeVariable = useStore($activeVariable)
  const activeStation = useStore($activeStation)
  const activeStationTs = useStore($activeStationTs)
  const activeStationObsStr = useStore($activeStationObsStr)

  const { data: stations, isSuccess, isPending, isFetching, isFetched } = useWeather()
  const dataIsReady = computed(() => !isFetching.value && isFetched.value)

  const getVisibleStations = () => {
    const mapBnds = map.value?.getBounds()
    if (stations.value) {
      const vStn = stations.value.features
        .filter(({ properties: { lon, lat } }) => mapBnds?.contains(new LngLat(lon, lat)))
        .map(({ properties }) => properties as StationObs)
      return vStn
    }
    return []
  }
  const visibleStations = ref<StationObs[]>()

  const visibleStationsSorted = computed(() => {
    const activePt = new LngLat(activeStation.value.lon, activeStation.value.lat)

    return visibleStations.value
      ?.map((props) => ({ ...props, dist: new LngLat(props.lon, props.lat).distanceTo(activePt) }))
      ?.sort(({ dist: d1 }, { dist: d2 }) => (d1 && d2 ? d1 - d2 : 0))
  })

  const activeStationTsStr = computed(() =>
    activeStationTs.value ? format(activeStationTs.value, 'd MMM yyyy, h:mm bbb') : null,
  )

  const showPoint = () => {
    try {
      const { lat, lon } = activeStation.value
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

  const handleStationChange = (st?: number | string | StationObs) => {
    const newStn =
      (typeof st === 'number' || typeof st === 'string' ? visibleStations.value?.find(({ id }) => id === st) : st) ??
      visibleStations.value?.[0] ??
      defaultStation
    setActiveStation(newStn)
    showPoint()
  }

  const handleMapScopeChange = () => {
    if (mapToggle.value) {
      map.value?.setCenter([121.80434, 12.5549]).setZoom(4.5)
    } else {
      map.value?.setCenter([121.04, 14.56]).setZoom(9.5)
    }
  }

  const loadLayer = () => {
    const sourceId = 'station'
    unloadLayer()
    visibleStations.value = getVisibleStations()
    map.value?.addSource(sourceId, {
      type: 'geojson',
      data: stations.value as any,
    })
    map.value?.addLayer({
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

  const unloadLayer = () => {
    const sourceId = 'station'

    if (map.value?.style && map.value?.getSource(sourceId)) {
      const { _layers: layers } = map.value.style

      Object.values(layers).forEach((l) => {
        if (l.source === sourceId) {
          map.value?.removeLayer(l.id)
        }
      })
      map.value?.removeSource(sourceId)
    }
  }

  watch(dataIsReady, (isReady) => {
    if (isReady) loadLayer()
  })

  watch(activeVariable, (newVar) => {
    const metVars = Object.keys(stations.value?.features[0].properties?.colors ?? {})
    const val: any = metVars.indexOf(newVar) !== -1 ? ['to-color', ['get', newVar, ['get', 'colors']]] : '#ffffff'
    map.value?.setPaintProperty('station-pts', 'circle-color', val)
  })

  onMounted(() => {
    map.value = new mapboxgl.Map({
      accessToken: props.token,
      container: mapEl.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [121.04, 14.56],
      zoom: 9.5,
      attributionControl: false,
    }).once('load', ({ target: m }) => {
      loadLayer()

      m.on('click', 'station-pts', (e) => {
        if (e.features) {
          const {
            properties: { id },
          } = e.features[0] as any
          handleStationChange(id)
        }
      })

      m.on('mouseenter', 'station-pts', () => {
        m.getCanvas().style.cursor = 'pointer'
      })

      m.on('mouseleave', 'station-pts', () => {
        m.getCanvas().style.cursor = ''
      })

      m.on('movestart', () => {
        hidePoint()
      })

      m.on('moveend', () => {
        visibleStations.value = getVisibleStations()
        showPoint()
      })
    })
  })

  onUnmounted(() => {
    unloadLayer()
    map.value?.remove()
  })
</script>
