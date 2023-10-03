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
              <div class="">24 hour total {{ station?.obs.rain_accum }} mm</div>
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

  import { LatestStationObservation } from '@/schemas/station'

  const props = withDefaults(
    defineProps<{
      stationId?: number
    }>(),
    { stationId: 1 }
  )

  const dateStr = computed(() => format(parseISO(station.value?.obs.timestamp), 'h:mm a EEEE, MMM d yyyy'))

  const txTime = computed(() => format(parseISO(station.value?.obs.tx_timestamp), 'h:mm a'))
  const tnTime = computed(() => format(parseISO(station.value?.obs.tn_timestamp), 'h:mm a'))

  const heatIndex = computed(() => {
    const { temp, rh, hi } = station.value?.obs

    if (hi === undefined || hi === null) {
      const tf = Math.floor((temp * 9.0) / 5.0 + 32.0 + 0.5)

      // return null outside the specified range of input parameters
      if (tf < 76 || tf > 126) return null
      if (rh < 0 || rh > 100) return null

      // according to the NWS, we try this first, and use it if we can
      let hiEasyF = 0.5 * (tf + 61.0 + (tf - 68.0) * 1.2 + rh * 0.094)

      // The NWS says we use tHeatEasy if (tHeatHeasy + t)/2 < 80.0
      // This is the same computation:
      if (hiEasyF + tf < 160.0) {
        const hiEasyC = (hiEasyF - 32.0) * (5.0 / 9.0)
        return Math.round(hiEasyC * 10) / 10
      }

      // need to use the hard form, and possibly adjust.
      const tf2 = tf * tf
      const rh2 = rh * rh
      let hiF =
        -42.379 +
        2.04901523 * tf +
        10.14333127 * rh -
        0.22475541 * tf * rh -
        0.00683783 * tf2 -
        0.05481717 * rh2 +
        0.00122874 * tf2 * rh +
        0.00085282 * tf * rh2 -
        0.00000199 * tf2 * rh2

      // these adjustments come from the NWA page, and are needed to
      // match the reference table.
      let tAdjF: number
      if (rh < 13.0 && 80.0 <= tf && tf <= 112.0)
        tAdjF = -((13.0 - rh) / 4.0) * Math.sqrt((17.0 - Math.abs(tf - 95.0)) / 17.0)
      else if (rh > 85.0 && 80.0 <= tf && tf <= 87.0) tAdjF = ((rh - 85.0) / 10.0) * ((87.0 - tf) / 5.0)
      else tAdjF = 0

      // apply the adjustment
      hiF += tAdjF

      // finally, the reference tables have no data above 183 (rounded),
      // so filter out answers that we have no way to vouch for.
      if (hiF >= 183.5) return null
      else {
        const hiC = (hiF - 32.0) * (5.0 / 9.0)
        return Math.round(hiC * 10) / 10
      }
    }

    return hi
  })

  const getStationObs = async () => {
    const url = `https://panahon.observatory.ph/data/api/v1/stations/${props.stationId}/observations/latest`
    const { data } = await axios.get(url)
    return LatestStationObservation.parse(data)
  }

  const { isSuccess, data: station } = useQuery({
    queryKey: ['station', props.stationId, 'latest'],
    queryFn: getStationObs,
    refetchInterval: 10 * 60 * 1000,
  })
</script>
