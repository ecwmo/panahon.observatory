import { nanoquery } from '@nanostores/query'
import { z } from 'zod'

import { StationConfigurations } from '@/schemas/station'
import { apiRoute } from '@/stores/routes'

const API_URL = apiRoute('stations/weather_conf')

const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: async (...keys: string[]) => await axios.get(API_URL).then(({ data }) => StationConfigurations.parse(data)),
})

export const stationConf = createFetcherStore<z.infer<typeof StationConfigurations>>([])
