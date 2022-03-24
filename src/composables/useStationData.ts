import { ref, computed } from 'vue'
import axios from 'axios'

import { formatStnLayer, StationLayer } from '@/scripts/weather'

const useStationData = () => {
  const stationLayer = ref(<StationLayer>{})
  const timestamp = ref(new Date())

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

  const fetchData = async () => {
    stationLayer.value = JSON.parse(localStorage.getItem('station') || 'null')
    const newTimestamp = await axios.get('/api/stations.php?timestamp').then(({ data }) => new Date(data.timestamp))
    timestamp.value = new Date(JSON.parse(localStorage.getItem('stationTimestamp') ?? JSON.stringify(new Date())))

    if (!stationLayer.value || newTimestamp.getTime() !== timestamp.value.getTime()) {
      const rawData = await axios.get('/api/stations.php').then(({ data }) => data)
      localStorage.setItem('stationTimestamp', JSON.stringify(rawData[0].obs.timestamp))
      stationLayer.value = formatStnLayer(rawData)
      localStorage.setItem('station', JSON.stringify(stationLayer.value))
    }
  }

  fetchData()

  return { timestamp, stationLayer, fetchData }
}

export { useStationData }
