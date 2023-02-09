<template>
  <div class="grid grid-flow-row md:grid-cols-2 gap-3 md:gap-6">
    <template v-if="stnStore.stationName">
      <Card
        v-for="c in cards"
        :key="c.title"
        :data="c"
        :is-active="c.id === stnStore.activeVariable"
        @click="stnStore.setActiveVariable(c.id)"
      >
        <WeatherDescription
          :id="c.id"
          :data="stnStore.metValueStrings"
          :station-name="stnStore.stationName"
          :date-string="stnStore.dateString('h bbb')"
        />
      </Card>
    </template>
    <template v-else>
      <FakeCard v-for="f in 4" :key="f" />
    </template>
  </div>
</template>

<script setup lang="ts">
  const stnStore = useStationStore()

  const cards = computed(() => {
    const windDirStr = stnStore.metValueStrings['wdirStr']
    return [
      {
        id: 'rain',
        title: 'RAIN (mm)',
        label1: 'Now',
        value1: stnStore.metValueStrings['rr'],
        label2: '24hr total',
        value2: stnStore.metValueStrings['rain24h'],
        iconName: 'fa6s-cloud-rain',
      },
      {
        id: 'temp',
        title: 'TEMPERATURE (°C)',
        value1: stnStore.metValueStrings['temp'],
        label2: 'HI',
        value2: stnStore.metValueStrings['hi'],
        iconName: 'fas-thermometer-half',
      },
      {
        id: 'wind',
        title: 'WIND (m/s)',
        value1: stnStore.metValueStrings['wspd'],
        value2: windDirStr,
        iconName: 'fa6s-wind',
        iconName2: 'wi-wind-deg',
      },
      {
        id: 'pres',
        title: 'PRESSURE (hPa)',
        value1: stnStore.metValueStrings['pres'],
        iconName: 'wi-barometer',
      },
    ]
  })
</script>
