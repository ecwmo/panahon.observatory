import { computed } from 'nanostores'

import { createFetcherStore, isReady } from './fetcher'

import { StationConfigurations } from '@/schemas/station'
import { apiRoute } from '@/stores/routes'

const API_URL = apiRoute('stations/weather_conf')

const _stationConf = createFetcherStore([API_URL])
export const stationConf = computed(_stationConf, (res) =>
  isReady(res) ? StationConfigurations.parse(res.data) : undefined
)
