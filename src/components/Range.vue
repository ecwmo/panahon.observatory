<template>
  <div v-if="numTicks" class="flex justify-center items-center gap-1 md:gap-2">
    <fieldset class="relative flex flex-col flex-1 mt-4 md:mt-8">
      <Popup
        class="absolute w-12 -ml-[1.6rem] md:-ml-6 mb-2.5 md:mb-4 px-1 py-0.5 text-center text-xs rounded-lg pointer-events-none"
        :style="{ left: popupXPos }"
        :show="ticks?.[modelValue]?.popup !== undefined"
        theme="bg-gray-500 text-gray-200 fill-gray-500"
      >
        {{ ticks?.[modelValue]?.popup }}
      </Popup>
      <input
        v-model.number="modelValue"
        :min="$minVal"
        :max="$maxVal"
        :step="step"
        type="range"
        class="appearance-none w-full h-0.5 bg-white rounded outline-none"
      />
      <svg
        class="w-full overflow-visible fill-current text-gray-200 px-1.5 md:px-2"
        role="presentation"
        viewBox="0 0 400 24"
        xmlns="http://www.w3.org/2000/svg"
        data-test="range-ticks"
      >
        <g v-for="t in tickElements">
          <rect :x="t.x" y="6" :width="t.width" :height="t.height" />
          <text v-if="t.text" class="text-xs font-semibold" :x="t.x" y="24" text-anchor="middle">
            {{ t.text }}
          </text>
        </g>
      </svg>
    </fieldset>
    <div
      v-if="canPlay"
      class="md:text-2xl cursor-pointer shadow-lg rounded-full text-gray-500 hover:text-gray-200"
      data-test="play-pause"
      :class="[isPlaying ? 'i-fa6-solid-circle-pause' : 'i-fa6-solid-circle-play']"
      @click.prevent="togglePlay"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, toRefs } from 'vue'

  import Popup from '@/components/Popup.vue'

  export type RangeTicks = Record<number, { label?: string; popup?: string }>

  const props = withDefaults(
    defineProps<{
      ticks?: RangeTicks
      minVal?: number
      maxVal?: number
      step?: number
      canPlay?: boolean
      timerDelay?: number
    }>(),
    {
      step: 1,
      canPlay: false,
      timerDelay: 1000,
    }
  )

  const modelValue = defineModel<number>({ required: true })

  const isPlaying = ref(false)
  const sliderTimer = ref()

  const { minVal, maxVal, step, ticks, timerDelay } = toRefs(props)

  const $minVal = computed(() =>
    minVal.value !== undefined ? minVal.value : ticks.value ? Math.min(...Object.keys(ticks.value).map(Number)) : 0
  )
  const $maxVal = computed(() => {
    const valx =
      maxVal.value !== undefined ? maxVal.value : ticks.value ? Math.max(...Object.keys(ticks.value).map(Number)) : 0
    return valx % step.value === 0 ? valx : valx + (step.value - (valx % step.value))
  })

  const numTicks = computed(() => Math.round(($maxVal.value - $minVal.value) / step.value) + 1)

  const ratio = (val: number) => (100 * (val - $minVal.value)) / ($maxVal.value - $minVal.value)

  const tickElements = computed(() =>
    Array.from({ length: numTicks.value }, (_, t) => {
      const curVal = $minVal.value + t * step.value
      const x = `${ratio(curVal)}%`
      return {
        val: curVal,
        x,
        height: curVal === modelValue.value ? 7 : 4,
        width: curVal === modelValue.value ? 1.4 : 0.5,
        text: ticks.value?.[curVal]?.label,
      }
    })
  )

  const popupXPos = computed(() => {
    const r = ratio(modelValue.value)
    return !isNaN(r) ? `calc(${r}% + (${8 - r * 0.15}px))` : '0px'
  })

  const play = () => {
    if (isPlaying.value) {
      sliderTimer.value = setTimeout(() => {
        let idx = tickElements.value.findIndex((t) => t.val === modelValue.value)
        idx = idx !== -1 ? (idx + 1) % numTicks.value : 0
        modelValue.value = tickElements.value[idx].val
        play()
      }, timerDelay.value)
    }
  }

  const pause = () => {
    clearTimeout(sliderTimer.value)
  }

  const togglePlay = () => {
    isPlaying.value = !isPlaying.value
    isPlaying.value ? play() : pause()
  }

  onMounted(() => {
    if (isPlaying.value) play()
  })
</script>

<style>
  input[type='range']::-webkit-slider-thumb {
    @apply appearance-none bg-gray-500 hover:bg-gray-200 w-3 h-3 md:w-4 md:h-4 rounded-full cursor-pointer;
  }
</style>
