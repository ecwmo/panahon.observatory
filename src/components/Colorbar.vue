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
  const props = defineProps({
    name: { type: String, required: true },
  })

  const { name } = toRefs(props)

  const stationStore = useStationStore()

  const varTitle = computed(() => stationStore.stationConf?.[name.value]?.desc ?? '')
  const varUnits = computed(() => stationStore.stationConf?.[name.value]?.units ?? '')

  const palette = computed(() => stationStore.getSwatch(name.value))
</script>
