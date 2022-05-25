<template>
  <div class="flex flex-wrap justify-center gap-3 md:gap-6">
    <Suspense>
      <Card
        v-for="c in cards"
        :key="c.title"
        :data="c"
        :isActive="c.id === modelValue"
        @click="$emit('update:modelValue', c.id)"
      >
        <component :is="c.info" :data="metValueStrings" :stationName="stationName" :dateString="cardDateString" />
      </Card>
      <template #fallback>
        <FakeCard v-for="c in fakeCards" :key="c.title" />
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
  import { toRefs, computed, defineAsyncComponent } from 'vue'

  import useDate from '@/composables/useDate'
  import useWeather from '@/composables/useWeather'

  import FakeCard from '@/components/FakeCard.vue'

  const Card = defineAsyncComponent({ loader: () => import('@/components/Card.vue') })
  const RainInfo = defineAsyncComponent({ loader: () => import('@/components/longinfo/Rain.vue') })
  const TempInfo = defineAsyncComponent({ loader: () => import('@/components/longinfo/Temp.vue') })
  const WindInfo = defineAsyncComponent({ loader: () => import('@/components/longinfo/Wind.vue') })
  const PresInfo = defineAsyncComponent({ loader: () => import('@/components/longinfo/Pres.vue') })

  const props = defineProps({
    data: { type: Object, required: true },
    modelValue: { type: String },
    timestamp: { type: Date, default: new Date() },
  })

  const emit = defineEmits(['update:modelValue'])

  const { data, timestamp } = toRefs(props)

  const { formatDate } = useDate()
  const { metValueString } = useWeather()

  const stationName = computed(() => data.value.name)

  const cardDateString = computed(() => formatDate('h bbb', timestamp.value))

  const metValueStrings = computed(() => {
    const ret: { [k: string]: string } = {}
    const metVars = ['rr', 'rain24h', 'temp', 'hi', 'tx', 'tn', 'wspd', 'wdirStr', 'pres']

    metVars.forEach((v) => {
      ret[v] = metValueString(data.value.obs, v)
    })

    return ret
  })

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
    const windDirStr = metValueStrings.value['wdirStr']
    const winDirIcon = windDirStr ? `wi-from-${windDirStr.toLowerCase()}` : ''
    return [
      {
        id: 'rain',
        title: 'RAIN (mm)',
        label1: 'Now',
        value1: metValueStrings.value['rr'],
        label2: '24hr total',
        value2: metValueStrings.value['rain24h'],
        iconClass: 'fas fa-cloud-rain',
        info: RainInfo,
      },
      {
        id: 'temp',
        title: 'TEMPERATURE (°C)',
        value1: metValueStrings.value['temp'],
        label2: 'HI',
        value2: metValueStrings.value['hi'],
        iconClass: 'fas fa-thermometer-half',
        info: TempInfo,
      },
      {
        id: 'wind',
        title: 'WIND (m/s)',
        value1: metValueStrings.value['wspd'],
        value2: windDirStr,
        iconClass: 'fas fa-wind',
        iconClass2: `wi wi-wind ${winDirIcon}`,
        info: WindInfo,
      },
      {
        id: 'pres',
        title: 'PRESSURE (hPa)',
        value1: metValueStrings.value['pres'],
        iconClass: 'wi wi-barometer',
        info: PresInfo,
      },
    ]
  })
</script>
