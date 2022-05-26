<template>
  <div class="relative">
    <!-- Map -->
    <div ref="mapEl" class="shadow w-full h-full"></div>
    <Dot :xy="dotProps.xy" color="#ffc8c8" v-show="dotProps.show">
      <Popup class="w-16 -ml-[1.35rem] mb-1 rounded-lg px-0.5 py-1 drop-shadow-lg" :show="dotProps.showPopup">
        <component :is="activeInfo" :data="metValueStrings" class="text-xs text-center" />
      </Popup>
    </Dot>
    <div
      class="absolute flex justify-between top-2 left-2 bg-white pl-0.5 pr-3 py-1 rounded-full drop-shadow-md opacity-90 -space-x-2.5"
    >
      <Switch
        class="scale-[0.8] p-0.5"
        v-model:isOn="mapToggle"
        @update:isOn="handleMapScopeChange"
        labelRight="All data"
      />
      <select
        v-if="stationDataIsReady"
        :value="activeStationId"
        @change="handleStationIdChange(+($event.target as HTMLSelectElement).value)"
        class="w-24 text-xs border-2 border-slate-700"
      >
        <option v-for="(st, id) in stationData?.features" :key="id" :value="st.properties.id">
          {{ st.properties.name }}
        </option>
      </select>
    </div>
    <WeatherButtons :modelValue="activeVariable" @update:modelValue="$emit('update:activeVariable', $event)" />
    <Colorbar :name="activeVariable" />
  </div>
</template>

<script setup lang="ts">
  import { ref, toRefs, onMounted, watch, computed, defineAsyncComponent } from 'vue'
  import { Map, Point } from 'mapbox-gl'

  import useWeather, { StationGeoJsonProperties, StationLayer } from '@/composables/useWeather'
  import useLocation from '@/composables/useLocation'

  const Switch = defineAsyncComponent({ loader: () => import('@/components/Switch.vue') })
  const Colorbar = defineAsyncComponent({ loader: () => import('@/components/Colorbar.vue') })
  const WeatherButtons = defineAsyncComponent({ loader: () => import('@/components/WeatherButtons.vue') })
  const Dot = defineAsyncComponent({ loader: () => import('@/components/PulsatingDot.vue') })
  const Popup = defineAsyncComponent({ loader: () => import('@/components/Popup.vue') })

  const RainInfo = defineAsyncComponent({ loader: () => import('@/components/info/Rain.vue') })
  const TempInfo = defineAsyncComponent({ loader: () => import('@/components/info/Temp.vue') })
  const WindInfo = defineAsyncComponent({ loader: () => import('@/components/info/Wind.vue') })
  const PresInfo = defineAsyncComponent({ loader: () => import('@/components/info/Pres.vue') })

  const props = defineProps({
    accessToken: { type: String, required: true },
    activeVariable: { type: String, required: true },
    activeStation: { type: Object },
  })

  const emit = defineEmits(['update:activeVariable', 'update:activeStationId', 'update:activeStation'])

  const map = ref()
  const mapEl = ref()
  const dotProps = ref({ xy: <Point>{}, color: undefined, show: false, showPopup: false })
  const mapToggle = ref(false)
  const activeStationId = ref(1)

  const { accessToken, activeVariable, activeStation } = toRefs(props)

  const { data: stationData, isSuccess: stationDataIsReady, metValueString } = useWeather()
  const { data: userPosition, isSuccess: positionIsReady } = useLocation()

  const activeInfo = computed(() => {
    switch (activeVariable.value) {
      case 'rain':
        return RainInfo
      case 'wind':
        return WindInfo
      case 'pres':
        return PresInfo
      default:
        return TempInfo
    }
  })

  const metValueStrings = computed(() => {
    const ret: { [k: string]: string } = {}
    const metVars = ['rr', 'rain24h', 'temp', 'hi', 'tx', 'tn', 'wspd', 'wdirStr', 'pres']

    metVars.forEach((v) => {
      ret[v] = metValueString(activeStation?.value?.properties?.obs, v)
    })

    return ret
  })

  const showPoint = (st: StationGeoJsonProperties) => {
    try {
      const { lat, lon } = st
      const xy = map.value?.project([lon, lat])
      if (xy) dotProps.value = { ...dotProps.value, xy, show: true, showPopup: true }
    } catch {}
  }

  const getClosestPoint = () => {
    if (stationDataIsReady.value && positionIsReady.value) {
      const { latitude: userLat, longitude: userLng } = userPosition.value
      const d =
        stationData.value?.features?.map(
          ({ geometry: { coordinates } }) =>
            Math.pow(coordinates[0] - userLng, 2) + Math.pow(coordinates[1] - userLat, 2)
        ) ?? []
      const i = d.indexOf(Math.min(...d))
      const newId = stationData.value?.features?.[i].properties?.id ?? 1
      activeStationId.value = newId
      handleStationIdChange(newId)
    }
  }

  const handleStationIdChange = (newId: number) => {
    const newActiveStation = stationData?.value?.features?.find(({ properties: { id } }) => id === newId)
    activeStationId.value = newId
    emit('update:activeStation', newActiveStation)
    showPoint(<StationGeoJsonProperties>newActiveStation?.properties)
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

  watch([activeVariable], () => {
    const metVars = Object.keys(<Object>stationData?.value?.features[0].properties.colors)

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

    getClosestPoint()

    map.value.once('load', () => {
      map.value.addSource('station', {
        type: 'geojson',
        data: <any>stationData?.value,
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

      map.value.on('click', 'station-pts', (e: StationLayer) => {
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
        dotProps.value = { ...dotProps.value, show: false, showPopup: false }
      })

      map.value.on('moveend', () => {
        showPoint(activeStation?.value?.properties)
      })
    })
  })
</script>
