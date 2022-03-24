<template>
  <div class="flex flex-col mt-3 md:mt-6 gap-3 md:gap-6">
    <div class="flex flex-wrap justify-center gap-3 md:gap-6">
      <Card
        v-for="c in cards.slice(0, 2)"
        :key="c.title"
        :data="c"
        :isActive="c.id === modelValue"
        @click="$emit('update:modelValue', c.id)"
      >
        <component :is="c.info" :data="data" :stationName="stationName" :timestamp="timestamp" />
      </Card>
    </div>
    <div class="flex flex-wrap justify-center gap-3 md:gap-6">
      <Card
        v-for="c in cards.slice(2, 4)"
        :key="c.title"
        :data="c"
        :isActive="c.id === modelValue"
        @click="$emit('update:modelValue', c.id)"
      >
        <component :is="c.info" :data="data" :stationName="stationName" :timestamp="timestamp" />
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, computed } from 'vue'

  import { getMetValue } from '@/scripts/weather'

  import Card from '@/components/Card.vue'
  import RainInfo from '@/components/info/Rain.vue'
  import TempInfo from '@/components/info/Temp.vue'
  import WindInfo from '@/components/info/Wind.vue'
  import PresInfo from '@/components/info/Pres.vue'

  export default defineComponent({
    components: { Card },
    props: {
      data: { type: Object, required: true },
      modelValue: { type: String },
      timestamp: { type: Date, default: new Date() },
    },
    emits: ['update:modelValue'],
    setup(props) {
      const { data } = toRefs(props)

      const stationName = computed(() => data.value.name)

      const cards = computed(() => {
        const windDirStr = getMetValue(data.value.obs, 'wdirStr')
        const winDirIcon = windDirStr ? `wi-from-${windDirStr.toLowerCase()}` : ''
        return [
          {
            id: 'rain',
            title: 'RAIN (mm)',
            label1: 'Now',
            value1: getMetValue(data.value.obs, 'rr'),
            label2: '24hr total',
            value2: getMetValue(data.value.obs, 'rain24h'),
            iconClass: 'fas fa-cloud-rain',
            info: RainInfo,
          },
          {
            id: 'temp',
            title: 'TEMPERATURE (°C)',
            value1: getMetValue(data.value.obs, 'temp'),
            label2: 'HI',
            value2: getMetValue(data.value.obs, 'hi'),
            iconClass: 'fas fa-thermometer-half',
            info: TempInfo,
          },
          {
            id: 'wind',
            title: 'WIND (m/s)',
            value1: getMetValue(data.value.obs, 'wspd'),
            value2: windDirStr,
            iconClass: 'fas fa-wind',
            iconClass2: `wi wi-wind ${winDirIcon}`,
            info: WindInfo,
          },
          {
            id: 'pres',
            title: 'PRESSURE (hPa)',
            value1: getMetValue(data.value.obs, 'pres'),
            iconClass: 'wi wi-barometer',
            info: PresInfo,
          },
        ]
      })

      return { stationName, cards }
    },
  })
</script>
