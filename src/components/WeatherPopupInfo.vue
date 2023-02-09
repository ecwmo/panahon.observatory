<template>
  <div v-if="rain24hStr && id === 'rain'" class="flex flex-col">
    <div>
      {{ rain24hStr }}
    </div>
    <div class="text-[0.6rem]">(24hr)</div>
  </div>
  <div v-else-if="tempStr && id === 'temp'" class="flex flex-col">
    <div>
      {{ tempStr }}
    </div>
    <div v-if="showHi" class="text-[0.6rem]">{{ `HI: ${hiStr}` }}</div>
  </div>
  <div v-else-if="wspdStr && id === 'wind'" class="flex flex-col">
    <div>
      {{ wspdStr }}
    </div>
    <div v-if="wdirStr" class="text-[0.6rem]">
      {{ `(${wdirStr})` }}
    </div>
  </div>
  <div v-else-if="presStr && id === 'pres'">
    {{ presStr }}
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{ id: string; data: Record<string, string> }>()

  const { data } = toRefs(props)

  const rain24hStr = computed(() => (data.value?.['rain24h'] ? `${data.value?.['rain24h']} mm` : ''))

  const tempStr = computed(() => (data.value?.['temp'] ? `${data.value?.['temp']} °C` : ''))
  const hiStr = computed(() => (data.value?.['hi'] ? `${data.value?.['hi']} °C` : ''))

  const showHi = computed(() => data.value['hi'] !== '--')

  const wspdStr = computed(() => (data.value?.['wspd'] ? `${data.value?.['wspd']} m/s` : ''))
  const wdirStr = computed(() => data.value?.['wdirStr'])

  const presStr = computed(() => (data.value?.['pres'] ? `${data.value?.['pres']} hPa` : ''))
</script>
