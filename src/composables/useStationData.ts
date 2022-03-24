import { computed } from 'vue'
import axios from 'axios'
import { useQuery } from 'vue-query'

import { formatStnLayer, StationLayer } from '@/scripts/weather'

const useStationData = () => {
  const fallbackStationLayer: StationLayer = {
    type: '',
    features: [
      {
        type: '',
        geometry: {
          type: 'Point',
          coordinates: [0, 0],
        },
        properties: { id: 'null', obs: {} },
      },
    ],
  }

  const _fetchData = async () => {
    let stationLayer = await axios.get('/api/stations.php').then(({ data }) => data)
    localStorage.setItem('stationTimestamp', JSON.stringify(stationLayer[0].obs.timestamp))
    stationLayer = formatStnLayer(stationLayer)
    localStorage.setItem('station', JSON.stringify(stationLayer))
    return <StationLayer>stationLayer
  }

  const fetchData = async () => {
    let stationLayer: StationLayer = JSON.parse(localStorage.getItem('station') || 'null')
    if (!stationLayer) stationLayer = await _fetchData() // no data
    const ts = await axios.get('/api/stations.php?timestamp').then(({ data }) => new Date(data.timestamp))
    if (ts.getTime() !== timestamp.value.getTime()) stationLayer = await _fetchData() // old data
    return stationLayer
  }

  const { data, isSuccess } = useQuery('station', fetchData)

  const stationLayer = computed((): StationLayer => (isSuccess.value ? <StationLayer>data.value : fallbackStationLayer))

  const timestamp = computed(() => new Date(JSON.parse(localStorage.getItem('stationTimestamp') || 'null')))

  return { timestamp, stationLayer }
}

export { useStationData }
