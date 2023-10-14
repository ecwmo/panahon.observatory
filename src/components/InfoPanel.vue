<template>
  <div
    class="hidden md:w-1/2 md:h-full md:flex md:flex-col justify-center items-center text-sm text-center gap-2 md:gap-4"
  >
    <div class="flex flex-col md:items-start w-full mb-6">
      <div class="text-sm font-extralight">{{ dataTsStringLong }}</div>
      <div class="text-3xl font-semibold">{{ stationName }}</div>
    </div>
    <div class="grid grid-flow-row md:grid-cols-2 gap-3 md:gap-6">
      <template v-if="stationName">
        <Card
          v-for="c in cards"
          :key="c.title"
          :data="c"
          :is-active="c.id === activeVariable"
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
            :data="metValueStrings"
            :station-name="stationName"
            :date-string="dataTsStringShort"
          />
        </Card>
      </template>
      <template v-else>
        <FakeCard v-for="f in 4" :key="f" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { format } from 'date-fns'

  import { windDirDeg } from '@/lib/weather'

  import { $activeStation, $activeVariable, $metValueStrings, $timestamp, setActiveVariable } from '@/stores/station'

  const metValueStrings = useStore($metValueStrings)
  const timestamp = useStore($timestamp)
  const activeVariable = useStore($activeVariable)
  const activeStation = useStore($activeStation)

  const stationName = computed(() => activeStation.value.name)
  const dataTsStringLong = computed(() => format(timestamp.value, 'd MMM yyyy, h:mm bbb'))
  const dataTsStringShort = computed(() => format(timestamp.value, 'h:mm bbb'))

  const cards = computed(() => {
    const windDirStr = metValueStrings.value['wdirStr']
    return [
      {
        id: 'rain',
        title: 'RAIN (mm)',
        label1: 'Now',
        value1: metValueStrings.value['rain'],
        label2: '24hr total',
        value2: metValueStrings.value['rainAccum'],
        icon: 'i-fa6-solid-cloud-rain',
      },
      {
        id: 'temp',
        title: 'TEMPERATURE (°C)',
        value1: metValueStrings.value['temp'],
        label2: 'Feels like',
        value2: metValueStrings.value['hi'],
        icon: 'i-fa-solid-thermometer-half',
      },
      {
        id: 'wind',
        title: 'WIND (m/s)',
        value1: metValueStrings.value['wspd'],
        value2: windDirStr,
        icon: 'i-fa6-solid-wind',
        icon2: 'i-wi-wind-deg',
      },
      {
        id: 'pres',
        title: 'PRESSURE (hPa)',
        value1: metValueStrings.value['mslp'],
        icon: 'i-wi-barometer',
      },
    ]
  })
</script>
