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
        <component
          :is="c.info"
          :data="stnStore.metValueStrings"
          :station-name="stnStore.stationName"
          :date-string="stnStore.dateString('h bbb')"
        />
      </Card>
    </template>
    <template v-else>
      <FakeCard v-for="c in fakeCards" :key="c.title" />
    </template>
  </div>
</template>

<script setup lang="ts">
  const LonginfoRain = defineAsyncComponent({ loader: () => import('@/components/longinfo/Rain.vue') })
  const LonginfoTemp = defineAsyncComponent({ loader: () => import('@/components/longinfo/Temp.vue') })
  const LonginfoWind = defineAsyncComponent({ loader: () => import('@/components/longinfo/Wind.vue') })
  const LonginfoPres = defineAsyncComponent({ loader: () => import('@/components/longinfo/Pres.vue') })

  const stnStore = useStationStore()

  const fakeCards = [
    {
      id: 'rain',
      title: 'RAIN (mm)',
    },
    {
      id: 'temp',
      title: 'TEMPERATURE (°C)',
    },
    {
      id: 'wind',
      title: 'WIND (m/s)',
    },
    {
      id: 'pres',
      title: 'PRESSURE (hPa)',
    },
  ]

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
        info: LonginfoRain,
      },
      {
        id: 'temp',
        title: 'TEMPERATURE (°C)',
        value1: stnStore.metValueStrings['temp'],
        label2: 'HI',
        value2: stnStore.metValueStrings['hi'],
        iconName: 'fas-thermometer-half',
        info: LonginfoTemp,
      },
      {
        id: 'wind',
        title: 'WIND (m/s)',
        value1: stnStore.metValueStrings['wspd'],
        value2: windDirStr,
        iconName: 'fa6s-wind',
        iconName2: 'wi-wind-deg',
        info: LonginfoWind,
      },
      {
        id: 'pres',
        title: 'PRESSURE (hPa)',
        value1: stnStore.metValueStrings['pres'],
        iconName: 'wi-barometer',
        info: LonginfoPres,
      },
    ]
  })
</script>
