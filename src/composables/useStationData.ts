import axios from 'axios'
import { useQuery } from 'vue-query'

import { formatStnLayer } from '@/scripts/weather'

const useStationData = () => {
  const fetchData = () => axios.get('/api/stations.php').then(({ data }) => formatStnLayer(data))
  return useQuery('stationData', fetchData)
}

export default useStationData
