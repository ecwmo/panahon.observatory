<template>
  <div class="relative">
    <!-- Map -->
    <div ref="mapEl" class="shadow w-full h-full"></div>

    <div v-if="stnStore.data">
      <PulsatingDot v-show="dotProps.show" :xy="dotProps.xy" color="#ffc8c8">
        <Popup class="w-16 -ml-[1.35rem] mb-1 rounded-lg px-0.5 py-1 drop-shadow-lg" :show="dotProps.showPopup">
          <component :is="activeInfo" :data="stnStore.metValueStrings" class="text-xs text-center" />
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
          :model-value="stnStore.activeStation"
          :stations="visibleStations"
          class="w-32 sm:w-48"
          @update:model-value="handleStationChange"
        />
      </div>
      <div
        class="absolute flex md:hidden justify-between top-2 right-2 bg-white text-black py-1 px-2 text-xs font-semibold rounded-full drop-shadow-md opacity-90"
      >
        {{ stnStore.dateString('d MMM yyyy, h bbb') }}
      </div>

      <WeatherButtons class="right-2 bottom-24 bg-white px-1 py-2.5 drop-shadow-md opacity-90" />
      <Colorbar class="bottom-2 right-2 bg-white p-2 rounded-md drop-shadow-md opacity-90" />
    </div>
    <LoadingIcon v-else class="absolute top-0 left-0 w-full h-full" svg-class="w-16 h-16 text-slate-500" />
  </div>
</template>

<script setup lang="ts">
  import { Map, LngLat } from 'mapbox-gl'

  import { storeToRefs } from 'pinia'

  import type { Station, StationProperties } from '@/types/station'

  const InfoRain = defineAsyncComponent({ loader: () => import('@/components/info/Rain.vue') })
  const InfoTemp = defineAsyncComponent({ loader: () => import('@/components/info/Temp.vue') })
  const InfoWind = defineAsyncComponent({ loader: () => import('@/components/info/Wind.vue') })
  const InfoPres = defineAsyncComponent({ loader: () => import('@/components/info/Pres.vue') })

  const props = defineProps({
    accessToken: { type: String, required: true },
  })

  const map = ref()
  const mapEl = ref()
  const dotProps = ref({ xy: {}, color: undefined, show: false, showPopup: false })
  const mapToggle = ref(false)
  const stnStore = useStationStore()
  const { activeVariable } = storeToRefs(stnStore)

  const { accessToken } = toRefs(props)

  const visibleStations = computed(() => {
    try {
      const mapBnds = map.value.getBounds()

      return stnStore.data?.features
        ?.map(({ properties }) => properties)
        ?.filter(({ lon, lat }) => mapBnds.contains(new LngLat(lon, lat)))
        ?.sort(({ id: id1 }, { id: id2 }) => id1 - id2)
    } catch {
      return stnStore.data?.features?.map(({ properties }) => properties)?.sort(({ id: id1 }, { id: id2 }) => id1 - id2)
    }
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

  const showPoint = () => {
    try {
      const { lat, lon } = stnStore.activeStation
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

  const handleStationChange = (st?: number | StationProperties) => {
    stnStore.setActiveStation(st, visibleStations.value)
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
          data: stnStore.data,
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
        handleStationChange()
      }
    }
  }

  watch([activeVariable], () => {
    const metVars = Object.keys(stnStore.data?.features[0].properties.colors ?? {})

    if (metVars.indexOf(activeVariable.value) !== -1) {
      map.value.setPaintProperty('station-pts', 'circle-color', [
        'to-color',
        ['get', activeVariable.value, ['get', 'colors']],
      ])
    } else {
      map.value.setPaintProperty('station-pts', 'circle-color', '#ffffff')
    }
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
