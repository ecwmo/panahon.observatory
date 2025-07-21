<template>
  <div v-show="varTitle" class="absolute flex flex-col justify-center bg-white text-black p-2">
    <div class="flex justify-center" :class="{ 'mb-2': palette?.colors?.length > 0 }">
      <div class="text-xs font-semibold justify-center">{{ `${varTitle} (${varUnits})` }}</div>
    </div>
    <div v-show="palette" class="flex">
      <div v-for="(c, idx) in palette.colors" :key="c" class="flex flex-col">
        <div
          class="w-8 h-5 border border-black"
          :class="idx > 0 ? 'border-l-0' : ''"
          :style="`background-color:${c};`"
        ></div>
        <div class="text-xs self-center -ml-8">{{ palette.levels[idx - 1] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { useQuery } from '@tanstack/vue-query'
  import axios from 'axios'
  import { computed } from 'vue'

  import { $activeVariable } from '@/stores/station'

  import { stationConfigurations } from '@/schemas/station'

  const activeVariable = useStore($activeVariable)

  const fetchWeatherConf = async () => {
    const url = '/api/stations/weather_conf'
    const { data } = await axios.get(url)
    return stationConfigurations.parse(data)
  }

  const { data: stationConf } = useQuery({
    queryKey: ['stations', 'config'],
    queryFn: fetchWeatherConf,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const varTitle = computed(() => stationConf.value?.[activeVariable.value]?.desc ?? '')
  const varUnits = computed(() => stationConf.value?.[activeVariable.value]?.units ?? '')

  const palette = computed(() => {
    const { colors, levels } = stationConf.value?.[activeVariable.value]?.palette ?? { colors: [], levels: [] }
    return { colors, levels }
  })
</script>
