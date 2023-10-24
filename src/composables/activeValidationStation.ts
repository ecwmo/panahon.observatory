import { useStore } from '@nanostores/vue'
import { format } from 'date-fns'

import { stationValidation } from '@/schemas/station'
import { _apiRoute } from '@/stores/routes'

import { $activeStation } from '@/stores/station'
import { $selectedDate as $validationDate } from '@/stores/validation'

export const useActiveValidationStation = () => {
  const activeStation = useStore($activeStation)
  const valDate = useStore($validationDate)

  const stationID = computed(() => (activeStation.value.id !== -1 ? activeStation.value.id : 'null'))

  const getStationObs = async () => {
    const selectedValidationDateStr = format(valDate.value, 'yyyyMMdd') ?? ''
    const url = `${_apiRoute()}/validation/stations/${stationID.value}?dt=${selectedValidationDateStr}`
    const { data } = await axios.get(url)
    return stationValidation.parse(data)
  }

  const q = useQuery({
    queryKey: ['validation', 'stations', stationID, valDate],
    queryFn: getStationObs,
    refetchInterval: 10 * 60 * 1000,
  })

  return { ...q }
}
