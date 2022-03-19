<template>
  <div class="bg-gray-300 border border-t-0 border-black flex flex-col items-center">
    <div class="w-full flex flex-col md:flex-row bg-gray-400 border-b border-black text-xs p-3 gap-2 content-center">
      <!-- Map Switcher -->
      <div class="flex gap-1.5">
        <span class="hidden md:block">Map:</span>
        <label class="inline-flex items-center">
          <input type="radio" class="h-3 w-3" v-model="mapScope" value="ph" /><span class="ml-1">Philippines</span>
        </label>
        <label class="inline-flex items-center">
          <input type="radio" class="h-3 w-3" v-model="mapScope" value="mm" /><span class="ml-1">Metro Manila</span>
        </label>
      </div>
      <!-- Station Dropdown -->
      <select v-model="activeStationId">
        <option v-for="(st, id) in visibleStations" :key="id" :value="st.properties.id">
          {{ st.properties.name }}
        </option>
      </select>
    </div>
    <div class="flex flex-col-reverse md:flex-row md:justify-center gap-4 p-6">
      <MapBox
        class="flex md:flex md:flex-col hidden m-auto md:mx-0"
        :data="stationLayer"
        :activeVariable="activeVariable"
        :mapScope="mapScope"
        v-model:activeStationId="activeStationId"
        v-model:visibleStations="visibleStations"
      />
      <div class="flex text-sm text-center items-center">
        <div class="flex flex-col items-center gap-2 md:gap-4">
          <div class="flex flex-col md:items-start w-full">
            <div class="text-lg font-semibold">{{ activeStation.name }}</div>
            <div class="text-base italic font-light">{{ `as of ${formatDate()}` }}</div>
          </div>
          <InfoPanel :data="activeStation" :timestamp="timeStamp" v-model="activeVariable" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, computed, onMounted, defineComponent } from 'vue'
  import axios from 'axios'
  import { format } from 'date-fns'

  import { StationLayer, formatStnLayer } from '@/scripts/weather'

  import Header from '@/components/Header.vue'
  import MapBox from '@/components/MapBox.vue'
  import InfoPanel from '@/components/InfoPanel.vue'

  export default defineComponent({
    components: { Header, MapBox, InfoPanel },
    setup() {
      const defaultStationId = '1'
      const timeStamp = ref(new Date())
      const mapScope = ref('mm')
      const stationObs = ref({})
      const stationLayer = ref(<StationLayer>{})
      const activeStationId = ref(defaultStationId)
      const activeVariable = ref('temp')
      const visibleStations = ref(<StationLayer['features']>[])

      const activeStation = computed(() => {
        if (visibleStations.value !== undefined) {
          const st = visibleStations.value.find(({ properties: { id } }) => id === activeStationId.value)
          if (st !== undefined) {
            return st.properties
          }
        }
        return { id: '', name: '', obs: {} }
      })

      const formatDate = (strFormat = 'MMMM d, yyyy h:00 bbb') => format(timeStamp.value, strFormat)

      onMounted(async () => {
        const rawData = await Promise.all([
          axios.get('/resources/station/stn_map_ph.json').then(({ data }) => data),
          axios.get('/resources/station/stn_mo_obs.json').then(({ data }) => data),
          axios.get('/resources/station/stn_obs.json').then(({ data }) => data),
        ])

        stationObs.value = { ...rawData[1], ...rawData[2] }
        stationLayer.value = formatStnLayer(rawData[0], stationObs.value)

        visibleStations.value = stationLayer.value.features

        timeStamp.value = await axios
          .get('/resources/station/stn_obs_timestamp.json')
          .then(({ data: { timestamp } }) => new Date(timestamp))
      })

      return {
        mapScope,
        stationLayer,
        visibleStations,
        activeStationId,
        activeStation,
        activeVariable,
        timeStamp,
        formatDate,
      }
    },
  })
</script>
