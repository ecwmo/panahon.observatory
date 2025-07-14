<template>
  <div
    class="relative hidden md:w-1/2 md:h-full md:flex md:flex-col justify-center items-center text-sm text-center gap-2 md:gap-4" 
  > <!-- Background of the right half of index screen -->
    <div class="absolute top-0 right-0">
      <NotivueTest client:load />
    </div>
    <div class="flex flex-col md:items-start w-full mb-6">
      <div class="text-sm font-extralight">{{ tsStringLong }}</div> <!-- information above info cards -->
      <div class="text-3xl font-semibold">{{ stationName }}</div>
    </div>
    <div class="grid grid-flow-row md:grid-cols-2 gap-3 md:gap-6">
      <Card
        v-for="c in cards"
        :key="c.title"
        :data="c"
        :is-active="c.id === activeVariable"
        :is-loading="isPending"
        @click="setActiveVariable(c.id)"
      >
        <template #icon1>
          <div class="text-4xl md:text-5xl" :class="c.icon" />
        </template>
        <template #icon2>
          <div
            v-if="c.icon2"
            class="text-lg md:text-xl"
            :class="c.icon2"
            :style="{ transform: `rotate(${windDirDeg[c?.value2 ?? 'N']}deg)` }"
          />
        </template>
        <WeatherDescription
          :id="c.id"
          :data="activeStationObsStr"
          :station-name="stationName"
          :date-string="tsStringShort"
        />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { format } from 'date-fns'
  import { computed } from 'vue'

  import { useActiveWeatherStation } from '@/composables/activeWeatherStation'
  import { windDirDeg } from '@/lib/weather'

  import Card from '@/components/Card.vue'
  import WeatherDescription from '@/components/WeatherDescription.vue'
  import NotivueTest from '@/components/NotivueTest.vue'

  import {
    $activeStation,
    $activeStationObsStr,
    $activeStationTs,
    $activeVariable,
    setActiveVariable,
  } from '@/stores/station'

  const timestamp = useStore($activeStationTs)
  const activeVariable = useStore($activeVariable)
  const activeStation = useStore($activeStation)
  const activeStationObsStr = useStore($activeStationObsStr)

  const stationName = computed(() => activeStation.value?.name)
  const tsStringLong = computed(() =>
    timestamp.value ? format(timestamp.value, "d MMM yyyy, 'as of' h:mm bbb") : null,
  )
  const tsStringShort = computed(() => (timestamp.value ? format(timestamp.value, 'h:mm bbb') : undefined))

  const stationID = computed(() => activeStation.value.id)
  const { isPending } = useActiveWeatherStation({ id: stationID })

  const cards = computed(() => { //constructs the information in weather info cards
    return [
      {
        id: 'rain',
        title: 'RAIN (mm)',
        label1: 'Now',
        value1: activeStationObsStr.value?.rain,
        label2: '24hr total',
        value2: activeStationObsStr.value?.rainAccum,
        icon: 'i-fa6-solid-cloud-rain',
      },
      {
        id: 'temp',
        title: 'TEMPERATURE (°C)',
        value1: activeStationObsStr.value?.temp,
        label2: 'Feels like',
        value2: activeStationObsStr.value?.hi,
        icon: 'i-fa-solid-thermometer-half',
      },
      {
        id: 'wind',
        title: 'WIND (m/s)',
        value1: activeStationObsStr.value?.wspd,
        value2: activeStationObsStr.value?.wdirStr,
        icon: 'i-fa6-solid-wind',
        icon2: 'i-wi-wind-deg',
      },
      {
        id: 'pres',
        title: 'PRESSURE (hPa)',
        value1: activeStationObsStr.value?.mslp,
        icon: 'i-wi-barometer',
      },
    ]
  })

</script>
