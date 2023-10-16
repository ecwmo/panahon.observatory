<template>
  <div class="bg-gray-100 w-screen h-screen">
    <div class="p-2 space-y-1 text-gray-700">
      <div class="flex flex-col w-xl bg-white">
        <div class="bg-gray-700 text-gray-100 p-2">{{ isSuccess ? station?.name : 'No data to display' }}</div>
        <div v-if="isSuccess">
          <div class="flex w-full items-center p-2">
            <div class="w-1/2 text-5xl font-bold text-center">{{ station?.obs.temp }}&deg;C</div>
            <div class="w-1/2 flex flex-col text-center border-l">
              <div class="text-xl">
                <span class="font-bold">HIGH: {{ station?.obs.tx }}&deg;C</span> at {{ txTime }}
              </div>
              <div class="text-xl">
                <span class="font-bold">LOW: {{ station?.obs.tn }}&deg;C</span> at {{ tnTime }}
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center py-4 px-2 border-t">
              <div class="i-mdi-weather-windy text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Wind:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ station?.obs.wspd }}</span> m/s
              </div>
              <div class="">Gust {{ station?.obs.gust }} m/s</div>
            </div>
            <div class="flex items-center py-4 px-2 border-t">
              <div class="i-mdi-water-outline text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Humidity:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ station?.obs.rh }}</span> %
              </div>
              <div v-show="heatIndex" class="">Feels like {{ heatIndex }} &deg;C</div>
            </div>
            <div class="flex items-center py-4 px-2 border-t">
              <div class="i-mdi-weather-pouring text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Rain:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ station?.obs.rain }}</span> mm
              </div>
              <div class="">24 hour total {{ station?.obs.rainAccum }} mm</div>
            </div>
            <div v-show="station?.obs.mslp" class="flex items-center py-4 px-2 border-t">
              <div class="i-wi-barometer text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Pressure:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ station?.obs.mslp }}</span> mb
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
      stationId?: number
    }>(),
    { stationId: 1 }
  )

  const dateStr = computed(() => format(parseISO(station.value?.obs?.timestamp ?? ''), 'h:mm a EEEE, MMM d yyyy'))

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
    const url = `${apiRoute()}/stations/${props.stationId}/observations/latest`
    const { data } = await axios.get(url)
    return stationObsLatest.parse(data)
  }

  const { isSuccess, data: station } = useQuery({
    queryKey: ['station', props.stationId, 'latest'],
    queryFn: getStationObs,
    refetchInterval: 10 * 60 * 1000,
  })
</script>
