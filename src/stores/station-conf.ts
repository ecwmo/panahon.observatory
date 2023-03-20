import { nanoquery } from '@nanostores/query'
import { z } from 'zod'

import { StationConfigurations } from '@/schemas/station'
import { apiRoute } from '@/stores/routes'

const API_URL = apiRoute('stations/weather_conf')

const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: async (...keys: string[]) => {
    const res = await fetch(`${location.origin}${API_URL}`)
    return StationConfigurations.parse(await res.json())
  },
})

export const stationConf = createFetcherStore<z.infer<typeof StationConfigurations>>([])
