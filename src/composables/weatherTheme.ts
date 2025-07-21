import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'

import { stationConfigurations } from '@/schemas/station'

import { gradientScale } from '@/lib/color'

import type { Scale } from '@/lib/color'

export const useWeatherTheme = () => {
  const q = useQuery({
    queryKey: ['stations', 'config'],
    queryFn: async () => {
      const url = '/api/stations/weather_conf'
      const { data } = await axios.get(url)
      const dat = stationConfigurations.parse(data)

      return ['rain', 'temp'].reduce(
        (o, k) => {
          const { palette: { colors, levels } = { colors: ['#ffffff'], levels: [0, 1] } } = dat[k]
          return {
            ...o,
            [k]: gradientScale(colors, levels),
          }
        },
        {} as Record<string, Scale>,
      )
    },
  })

  return { ...q }
}
