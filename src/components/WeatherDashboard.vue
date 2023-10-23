<template>
  <div class="bg-gray-100 w-screen h-screen">
    <div class="p-2 space-y-1 text-gray-700">
      <div class="flex flex-col w-xl bg-white">
        <div class="bg-gray-700 text-gray-100 p-2">{{ isSuccess ? station?.name : 'No data to display' }}</div>
        <div v-if="isSuccess">
          <div class="flex w-full items-center p-2">
            <div class="w-1/2 text-5xl font-bold text-center">{{ obsStr.temp }}&deg;C</div>
            <div class="w-1/2 flex flex-col text-center border-l">
              <div class="text-xl">
                <span class="font-bold">HIGH: {{ obsStr?.tx }}&deg;C</span> at {{ txTime }}
              </div>
              <div class="text-xl">
                <span class="font-bold">LOW: {{ obsStr?.tn }}&deg;C</span> at {{ tnTime }}
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center py-4 px-2 border-t">
              <div class="i-mdi-weather-windy text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Wind:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ obsStr?.wspd }}</span> m/s
              </div>
              <div class="">Gust {{ obsStr?.gust }} m/s</div>
            </div>
            <div class="flex items-center py-4 px-2 border-t">
              <div class="i-mdi-water-outline text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Humidity:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ obsStr?.rh }}</span> %
              </div>
              <div v-show="obsStr?.hi" class="">Feels like {{ obsStr?.hi }} &deg;C</div>
            </div>
            <div class="flex items-center py-4 px-2 border-t">
              <div class="i-mdi-weather-pouring text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Rain:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ obsStr?.rain }}</span> mm
              </div>
              <div v-show="obsStr?.rainAccum" class="">24 hour total {{ obsStr?.rainAccum }} mm</div>
            </div>
            <div v-show="obsStr?.mslp" class="flex items-center py-4 px-2 border-t">
              <div class="i-wi-barometer text-2xl mr-2"></div>
              <div class="w-2/9 text-lg font-semibold">Pressure:</div>
              <div class="w-2/9">
                <span class="text-lg font-semibold">{{ obsStr?.mslp }}</span> mb
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
  import { useStore } from '@nanostores/vue'
  import { format, parseISO } from 'date-fns'

  const props = withDefaults(
    defineProps<{
      stationId?: string
      stationPt?: string
    }>(),
    { stationId: '', stationPt: '' }
  )

  const { stationId, stationPt } = toRefs(props)

  import { $activeStationObsStr, setActiveStation } from '@/stores/station'

  const obsStr = useStore($activeStationObsStr)

  const { station, isSuccess } = useActiveWeatherStation({ id: stationId, pt: stationPt })
  watch(isSuccess, () => {
    if (station.value) setActiveStation(station.value)
  })

  const dateStr = computed(() => format(parseISO(station.value?.obs?.timestamp ?? ''), 'h:mm a EEEE, MMM d yyyy'))

  const txTime = computed(() => format(parseISO(station.value?.obs?.txTimestamp ?? ''), 'h:mm a'))
  const tnTime = computed(() => format(parseISO(station.value?.obs?.tnTimestamp ?? ''), 'h:mm a'))
</script>
