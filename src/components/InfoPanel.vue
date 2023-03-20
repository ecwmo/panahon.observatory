<template>
  <div class="grid grid-flow-row md:grid-cols-2 gap-3 md:gap-6">
    <template v-if="stationName">
      <Card
        v-for="c in cards"
        :key="c.title"
        :data="c"
        :is-active="c.id === activeVar"
        @click="setActiveVariable(c.id)"
      >
        <WeatherDescription :id="c.id" :data="metValStrngs" :station-name="stationName" :date-string="dataTsString" />
      </Card>
    </template>
    <template v-else>
      <FakeCard v-for="f in 4" :key="f" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { format } from 'date-fns'

  import { activeStation, activeVariable, metValueStrings, setActiveVariable, timestamp } from '@/stores/station'

  const metValStrngs = useStore(metValueStrings)
  const dataTimestamp = useStore(timestamp)
  const activeVar = useStore(activeVariable)
  const activeStn = useStore(activeStation)

  const stationName = computed(() => activeStn.value.name)
  const dataTsString = computed(() => format(dataTimestamp.value, 'h bbb'))

  const cards = computed(() => {
    const windDirStr = metValStrngs.value['wdirStr']
    return [
      {
        id: 'rain',
        title: 'RAIN (mm)',
        label1: 'Now',
        value1: metValStrngs.value['rr'],
        label2: '24hr total',
        value2: metValStrngs.value['rain24h'],
        iconName: 'fa6s-cloud-rain',
      },
      {
        id: 'temp',
        title: 'TEMPERATURE (°C)',
        value1: metValStrngs.value['temp'],
        label2: 'HI',
        value2: metValStrngs.value['hi'],
        iconName: 'fas-thermometer-half',
      },
      {
        id: 'wind',
        title: 'WIND (m/s)',
        value1: metValStrngs.value['wspd'],
        value2: windDirStr,
        iconName: 'fa6s-wind',
        iconName2: 'wi-wind-deg',
      },
      {
        id: 'pres',
        title: 'PRESSURE (hPa)',
        value1: metValStrngs.value['pres'],
        iconName: 'wi-barometer',
      },
    ]
  })
</script>
