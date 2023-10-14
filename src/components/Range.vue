<template>
  <div class="flex justify-center items-center">
    <fieldset class="relative flex flex-col flex-1 mt-4 md:mt-8">
      <Popup
        class="absolute w-12 -ml-[1.6rem] md:-ml-6 mb-2.5 md:mb-4 px-1 py-0.5 text-center text-xs rounded-lg pointer-events-none"
        :style="{ left: popupXPos }"
        :show="ticks[curValIdx].popup !== undefined"
        theme="bg-gray-500 text-gray-200 fill-gray-500"
      >
        {{ ticks[curValIdx].popup }}
      </Popup>
      <input
        ref="rangeEl"
        :value="modelValue"
        :min="minVal"
        :max="maxVal"
        :step="step"
        type="range"
        class="appearance-none w-full h-0.5 bg-white rounded outline-none"
        @input="handleChange"
      />
      <svg
        class="w-full overflow-visible fill-current text-gray-200 px-1.5 md:px-2"
        role="presentation"
        viewBox="0 0 400 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g v-for="(t, i) in ticks" :key="t.text">
          <rect
            :x="getXPos(i)"
            y="6"
            :width="t.val === modelValue ? 1.4 : 0.5"
            :height="t.val === modelValue ? 7 : 4"
          />
          <text v-if="t.text" class="text-xs font-semibold" :x="getXPos(i)" y="24" text-anchor="middle">
            {{ t.text }}
          </text>
        </g>
      </svg>
    </fieldset>
    <div v-if="canPlay" class="p-1 md:p-2 md:text-2xl cursor-pointer text-gray-500 hover:text-gray-200">
      <div v-if="!isPlaying" class="i-fa6-solid-circle-play shadow-lg rounded-full" @click.prevent="handlePlayClick" />
      <div v-else class="i-fa6-solid-circle-pause shadow-lg rounded-full" @click.prevent="handlePauseClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      modelValue: number
      ticks: {
        val: number
        text?: string
        popup?: string
      }[]
      step?: number
      canPlay?: boolean
    }>(),
    {
      modelValue: 0,
      step: 1,
      canPlay: false,
    }
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
    (e: 'next', nextIdx: number): void
  }>()

  const rangeEl = ref()
  const isPlaying = ref(false)
  const sliderTimer = ref()
  const sliderInterval = 1000

  const tickVals = computed(() => props.ticks.map(({ val }) => val))

  const curValIdx = computed(() => props.ticks.findIndex(({ val }) => val === props.modelValue))

  const maxVal = computed(() => Math.max(...tickVals.value))
  const minVal = computed(() => Math.min(...tickVals.value))

  const popupXPos = computed(() => {
    const ratio = (100 * (props.modelValue - minVal.value)) / (maxVal.value - minVal.value)
    return !isNaN(ratio) ? `calc(${ratio}% + (${8 - ratio * 0.15}px))` : '0px'
  })

  const getXPos = (idx: number) => (props.ticks.length > 1 ? `${(100 * idx) / (props.ticks.length - 1)}%` : '0%')

  const handleChange = (ev: Event) => emit('update:modelValue', +(ev.target as HTMLInputElement).value)

  const play = () => {
    if (isPlaying.value) {
      // pause()
      sliderTimer.value = setTimeout(() => {
        const nextIdx = (curValIdx.value + 1) % props.ticks.length
        emit('next', nextIdx)
        play()
      }, sliderInterval)
    }
  }

  const pause = () => {
    clearTimeout(sliderTimer.value)
  }

  const handlePlayClick = () => {
    isPlaying.value = true
    play()
  }

  const handlePauseClick = () => {
    isPlaying.value = false
    pause()
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
