import { useStore } from '@nanostores/vue'
import { format } from 'date-fns'

import { stationObsLatest, stationValidation } from '@/schemas/station'
import { _apiRoute, apiRoute } from '@/stores/routes'

import { interpHexColor } from '@/lib/color'
import { geojsonize } from '@/lib/geojson'
import { heatIndex } from '@/lib/weather'

import { $viewType } from '@/stores/station'
import { $selectedDate as $validationDate } from '@/stores/validation'

export const useWeather = () => {
  const viewType = useStore($viewType)
  const valDate = useStore($validationDate)

  const { data: gradientFns, isSuccess: gradientFnsReady } = useWeatherTheme()

  const fetchStations = async () => {
    const selectedValidationDateStr = format(valDate.value, 'yyyyMMdd') ?? ''
    const url =
      viewType.value === 'validation'
        ? `${_apiRoute()}/stations/validation/${selectedValidationDateStr}`
        : `${apiRoute()}/observations/latest`
    const { data } = await axios.get(url)
    const schema = viewType.value === 'validation' ? stationValidation : stationObsLatest
    const dat = schema.array().parse(data)

    return geojsonize(
      dat.map((d) => {
        if ('obs' in d) {
          const { obs } = d
          const { temp, rh, hi, rainAccum } = obs
          const colors = {
            rain: interpHexColor(rainAccum ?? 0, gradientFns.value?.['rain']),
            temp: interpHexColor(temp ?? 0, gradientFns.value?.['temp']),
          }
          return {
            ...d,
            obs: {
              ...obs,
              hi: hi ? hi : heatIndex(temp ?? 0, rh ?? 0),
            },
            colors,
          }
        }
        return d
      }),
      ['tsImg', 'obs', 'colors']
    )
  }

  const q = useQuery({
    queryKey: ['stations', viewType, valDate],
    queryFn: fetchStations,
    enabled: gradientFnsReady,
    refetchInterval: 10 * 60 * 1000,
  })

  return { ...q }
}
