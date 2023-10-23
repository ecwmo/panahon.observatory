import { stationConfigurations } from '@/schemas/station'
import { _apiRoute } from '@/stores/routes'

import { gradientScale } from '@/lib/color'

import type { Scale } from '@/lib/color'

export const useWeatherTheme = () => {
  const twentyFourHoursInMs = 1000 * 60 * 60 * 24
  const q = useQuery({
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
      }, {} as Record<string, Scale>)
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: twentyFourHoursInMs,
  })

  return { ...q }
}
