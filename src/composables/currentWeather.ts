import { useStore } from '@nanostores/vue'
import type { MaybeRef } from 'vue'

import { heatIndex } from '@/lib/weather'
import { stationObsLatest } from '@/schemas/station'
import { apiRoute } from '@/stores/routes'

import { $viewType } from '@/stores/station'

type NearestStation = {
  id?: MaybeRef<number | string>
  pt?: MaybeRef<string>
}
export const useCurrentWeather = ({ id, pt }: NearestStation) => {
  const { coords } = useGeolocation()

  const viewType = useStore($viewType)

  const stnLocStr = computed(() => {
    const { latitude: lat, longitude: lon } = coords.value
    const _pt = unref(pt)
    if (_pt && _pt.split(',').length === 2) return pt
    if (Number.isFinite(lat) && Number.isFinite(lon)) return `${lon.toFixed(3)},${lat.toFixed(3)}`
    return ''
  })

  const stnID = computed(() => {
    const _id = unref(id)
    return _id && _id !== -1 ? _id : stnLocStr.value || '1'
  })

  const getStationObs = async () => {
    const url = !isNaN(+stnID.value)
      ? `${apiRoute()}/stations/${+stnID.value}/observations/latest`
      : `${apiRoute()}/stations/nearest/observations/latest?pt=${stnLocStr.value}`
    const { data } = await axios.get(url)
    const dat = stationObsLatest.parse(data)
    dat.obs.hi = dat.obs.hi ?? heatIndex(dat.obs.temp ?? 0, dat.obs.rh ?? 0)
    return dat
  }

  const { isSuccess, data: station } = useQuery({
    queryKey: ['station', stnID, 'latest'],
    queryFn: getStationObs,
    refetchInterval: 10 * 60 * 1000,
    enabled: viewType.value !== 'validation',
  })

  return { station, isSuccess }
}
