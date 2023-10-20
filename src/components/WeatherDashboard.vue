<template>
  <div class="bg-gray-100 w-screen h-screen">
    <div class="p-2 space-y-1 text-gray-700">
      <div class="flex flex-col w-xl bg-white">
        <div class="bg-gray-700 text-gray-100 p-2">{{ isSuccess ? station?.name : 'No data to display' }}</div>
        <div v-if="isSuccess">
          <div class="flex w-full items-center p-2">
            <div class="w-1/2 text-5xl font-bold text-center">{{ tempStr }}&deg;C</div>
            <div class="w-1/2 flex flex-col text-center border-l">
              <div class="text-xl">
                <span class="font-bold">HIGH: {{ txStr }}&deg;C</span> at {{ txTime }}
              </div>
              <div class="text-xl">
                <span class="font-bold">LOW: {{ tnStr }}&deg;C</span> at {{ tnTime }}
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center py-4 px-2 border-t">
              <div class="i-mdi-weather-windy text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Wind:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ wspdStr }}</span> m/s
              </div>
              <div class="">Gust {{ gustStr }} m/s</div>
            </div>
            <div class="flex items-center py-4 px-2 border-t">
              <div class="i-mdi-water-outline text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Humidity:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ rhStr }}</span> %
              </div>
              <div v-show="heatIndex" class="">Feels like {{ heatIndex }} &deg;C</div>
            </div>
            <div class="flex items-center py-4 px-2 border-t">
              <div class="i-mdi-weather-pouring text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Rain:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ rainStr }}</span> mm
              </div>
              <div v-show="rainAccStr" class="">24 hour total {{ rainAccStr }} mm</div>
            </div>
            <div v-show="presStr" class="flex items-center py-4 px-2 border-t">
              <div class="i-wi-barometer text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Pressure:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ presStr }}</span> mb
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isSuccess" class="text-xs font-semibold">Weather conditions as of: {{ dateStr }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { format, parseISO } from 'date-fns'

  import { heatIndex as heatIndexFn } from '@/lib/weather'
  import { stationObsLatest } from '@/schemas/station'
  import { apiRoute } from '@/stores/routes'

  const props = withDefaults(
    defineProps<{
      stationId?: string
      stationPt?: string
    }>(),
    { stationId: '', stationPt: '' }
  )

  const { stationId, stationPt } = toRefs(props)

  const { coords } = useGeolocation()

  const stnLocStr = computed(() => {
    const { latitude: lat, longitude: lon } = coords.value
    if (stationPt.value && stationPt.value.split(',').length === 2) return stationPt.value
    if (Number.isFinite(lat) && Number.isFinite(lon)) return `${lon.toFixed(3)},${lat.toFixed(3)}`
    return ''
  })

  const stnID = computed(() => (stationId.value ? stationId.value : stnLocStr.value || '1'))

  const dateStr = computed(() => format(parseISO(station.value?.obs?.timestamp ?? ''), 'h:mm a EEEE, MMM d yyyy'))

  const tempStr = computed(() => station.value?.obs.temp?.toFixed(1))
  const wspdStr = computed(() => station.value?.obs.wspd?.toFixed(1))
  const gustStr = computed(() => station.value?.obs.gust?.toFixed(1))
  const rhStr = computed(() => station.value?.obs.rh?.toFixed(0))
  const rainStr = computed(() => station.value?.obs.rain?.toFixed(0))
  const rainAccStr = computed(() => station.value?.obs.rainAccum?.toFixed(0))
  const presStr = computed(() => station.value?.obs.mslp?.toFixed(0))

  const tnStr = computed(() => station.value?.obs.tn?.toFixed(1))
  const txStr = computed(() => station.value?.obs.tx?.toFixed(1))
  const txTime = computed(() => format(parseISO(station.value?.obs?.txTimestamp ?? ''), 'h:mm a'))
  const tnTime = computed(() => format(parseISO(station.value?.obs?.tnTimestamp ?? ''), 'h:mm a'))

  const heatIndex = computed(() => {
    const { temp = 0, rh = 0, hi } = station.value?.obs ?? { temp: 0, rh: 0, hi: null }

    if (hi === undefined || hi === null) {
      return heatIndexFn(temp ?? 0, rh ?? 0)
    }

    return hi
  })

  const getStationObs = async () => {
    const url = !isNaN(+stnID.value)
      ? `${apiRoute()}/stations/${+stnID.value}/observations/latest`
      : `${apiRoute()}/stations/nearest/observations/latest?pt=${stnLocStr.value}`
    const { data } = await axios.get(url)
    return stationObsLatest.parse(data)
  }

  const { isSuccess, data: station } = useQuery({
    queryKey: ['station', stnID, 'latest'],
    queryFn: getStationObs,
    refetchInterval: 10 * 60 * 1000,
  })
</script>
