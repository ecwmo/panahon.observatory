<template>
  <div class="flex w-full h-screen items-center justify-center">
    <div v-if="station && activeCard" class="flex flex-col p-4 xl:p-8 border border-gray-300 rounded-xl shadow-md">
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <h1 class="text-2xl md:text-5xl xl:text-6xl font-bold text-blue-800">
            {{ station.name }} <span class="text-cyan-400">Weather</span>
          </h1>
          <p class="text-xs md:text-2xl xl:text-3xl text-blue-800">{{ dateStr }}</p>
        </div>
        <img src="/pwa-512x512.png" class="w-8 md:w-20" />
      </div>
      <div class="flex">
        <div class="flex flex-col justify-center items-start" :class="[activeCard.textColor]">
          <div class="flex justify-start items-start leading-none">
            <span class="text-[8rem] md:text-[16rem] lg:text-[18rem] xl:text-[20rem]">{{ mainValueStr }}</span>
            <span class="text-2xl md:text-6xl xl:text-7xl">{{ activeCard.unit }}</span>
          </div>
          <div class="text-xl md:text-4xl lg:text-5xl xl:text-6xl">{{ statementStr }}</div>
        </div>
        <div class="flex justify-center items-center">
          <div class="text-[12rem] md:text-[24rem] lg:text-[28rem] xl:text-[32rem]" :class="[category.icon]"></div>
        </div>
      </div>
      <div class="text-lg md:text-3xl xl:text-4xl flex flex-col justify-end items-start text-blue-800">
        <p v-for="action in category.actions">{{ action }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { format, parseISO } from 'date-fns'
  import { ref, computed, toRefs, watch, onMounted, onBeforeUnmount } from 'vue'
  import SunCalc from 'suncalc'

  import { $activeStationObsStr, setActiveStation } from '@/stores/station'
  import { useActiveWeatherStation } from '@/composables/activeWeatherStation'
  import { cloudCover } from '@/lib/weather'

  const props = withDefaults(
    defineProps<{
      stationId?: string
      stationPt?: string
      cardName?: string
      cycle?: boolean
    }>(),
    { stationId: '', stationPt: '', name: 'temp', cycle: false },
  )

  const { cardName, cycle, stationId, stationPt } = toRefs(props)

  type Card = {
    name: string
    unit: string
    textColor: string
  }
  const cards = computed<Card[]>(() => {
    let c = [
      {
        name: 'temp',
        unit: '°C',
        textColor: 'text-red-600',
      },
    ]

    if (isRaining.value) {
      c = [
        ...c,
        {
          name: 'rain',
          unit: 'mm/hr',
          textColor: 'text-cyan-400',
        },
      ]
    }

    return c
  })

  const isRaining = computed(() => {
    const rain = station.value?.obs?.rain ?? 0
    return rain >= 0.1
  })

  const activeCard = ref<Card>()
  let cycleInterval: ReturnType<typeof setInterval>

  const obsStr = useStore($activeStationObsStr)

  const { data: station, isSuccess } = useActiveWeatherStation({ id: stationId, pt: stationPt })
  watch(isSuccess, () => {
    if (station.value) setActiveStation(station.value)
  })

  const dateStr = computed(() => format(parseISO(station.value?.obs?.timestamp ?? ''), 'EEE, MMM d, h:mmaaa'))

  const isDaytime = computed(() => {
    const now = new Date()
    if (station.value) {
      const { lat, lon } = station.value
      const sunTime = SunCalc.getTimes(now, lat, lon)
      return now >= sunTime.sunriseEnd && now < sunTime.sunset
    }
    const hour = now.getHours()
    return hour >= 6 && hour < 18
  })

  const mainValueStr = computed(() => {
    let val = ''
    switch (activeCard.value?.name) {
      case 'temp':
        val = obsStr.value.temp
        break
      case 'rain':
        val = obsStr.value.rain
        break
    }
    return val.split('.')[0]
  })

  const statementStr = computed(() => {
    switch (activeCard.value?.name) {
      case 'temp':
        return `Feels like ${obsStr.value.hi.split('.')[0]}°C`
      case 'rain':
        return category.value.name
    }
    return ''
  })

  type Category = {
    name: string
    actions: string[]
    icon: string
  }
  const category = computed<Category>(() => {
    const now = new Date()
    const {
      lat,
      lon,
      obs: { rain, srad },
    } = station.value ?? { lat: 0, lon: 0, obs: { rain: 0, srad: 0 } }

    if (rain && rain >= 0.1) {
      if (rain < 2.6)
        return {
          name: 'Light rain',
          actions: ['Umaambon, magbaon ng payong, mahirap na...'],
          icon: isDaytime.value
            ? 'i-meteocons:partly-cloudy-day-rain-fill'
            : 'i-meteocons:partly-cloudy-night-rain-fill',
        }
      if (rain < 7.6)
        return {
          name: 'Moderate rain',
          actions: ['Magdala ng payong o kapote kung kailangan lumabas o bumiyahe.'],
          icon: isDaytime.value ? 'i-meteocons:overcast-day-rain-fill' : 'i-meteocons:overcast-night-rain-fill',
        }
      return {
        name: 'Heavy rain',
        actions: ['Malakas ang ulan! Mas mabuting hindi na muna lumabas.', 'Maaaring bumaha sa flood-prone areas.'],
        icon: isDaytime.value ? 'i-meteocons:extreme-day-rain-fill' : 'i-meteocons:extreme-night-rain-fill',
      }
    } else {
      const cCov = cloudCover(srad ?? 0, lat, lon, now)
      const c: Category = {
        name: cCov !== 'Night' ? cCov : '',
        actions: [],
        icon: '',
      }
      switch (cCov) {
        case 'Overcast':
          c.icon = isDaytime.value ? 'i-meteocons:overcast-day-fill' : 'i-meteocons:overcast-night-fill'
          c.actions = ['Maulap ngayon kaya hindi naman kailangan ng payong.']
          break
        case 'Clear':
          c.icon = isDaytime.value ? 'i-meteocons:clear-day-fill' : 'i-meteocons:clear-night-fill'
          c.actions = isDaytime.value
            ? ['Maaraw at mainit!', 'Magdala ng payong at mag-sunscreen.']
            : ['Malinaw ang langit ngayong gabi.']
          break
        case 'Night':
          c.icon = isDaytime.value ? 'i-meteocons:clear-day-fill' : 'i-meteocons:clear-night-fill'
          c.actions = ['Walang ulat sa kondisyon ng ulap.']
          break
        default:
          c.icon = isDaytime.value ? 'i-meteocons:partly-cloudy-day-fill' : 'i-meteocons:partly-cloudy-night-fill'
          c.actions = ['Maulap ngayon kaya hindi naman kailangan ng payong.']
      }
      return c
    }
  })

  onMounted(() => {
    activeCard.value = cards.value.find((card) => card.name === cardName.value) ?? cards.value[0]

    if (cycle.value) {
      cycleInterval = setInterval(() => {
        const idx = cards.value.findIndex((card) => card.name === activeCard.value?.name)
        const nextIdx = idx !== -1 ? (idx + 1) % cards.value.length : 0
        activeCard.value = cards.value?.[nextIdx]
      }, 8000)
    }
  })

  onBeforeUnmount(() => {
    clearInterval(cycleInterval)
  })
</script>
