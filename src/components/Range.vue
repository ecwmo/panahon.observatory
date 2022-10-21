<template>
  <div class="flex justify-center items-center">
    <fieldset class="flex flex-col flex-1 mt-4 md:mt-8">
      <input
        :value="modelValue"
        :min="Math.min(...tickVals)"
        :max="Math.max(...tickVals)"
        :step="step"
        type="range"
        class="appearance-none w-full h-0.5 bg-skin-body-fill-inv rounded outline-none slider-thumb"
        @input="handleChange"
      />
      <svg
        class="w-full overflow-visible fill-current text-skin-base px-1.5"
        role="presentation"
        viewBox="0 0 400 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g v-for="(t, i) in ticks" :key="t.text">
          <rect
            :x="`${(100 * i) / (ticks.length - 1)}%`"
            y="2"
            :width="t.val === modelValue ? 1.4 : 0.5"
            :height="t.val === modelValue ? 7 : 4"
          />
          <text
            v-if="t.text"
            class="text-xs font-semibold"
            :x="`${(100 * i) / (ticks.length - 1)}%`"
            y="18"
            text-anchor="middle"
          >
            {{ t.text }}
          </text>
        </g>
      </svg>
    </fieldset>
    <div v-if="canPlay" class="p-1 md:p-2 md:text-2xl cursor-pointer text-skin-button-accent hover:text-skin-base">
      <i-fa6-solid-circle-play v-show="!isPlaying" class="shadow-lg rounded-full" @click.prevent="handlePlayClick" />
      <i-fa6-solid-circle-pause v-show="isPlaying" class="shadow-lg rounded-full" @click.prevent="handlePauseClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: number
    ticks: {
      val: number
      text?: string
    }[]
    step?: number
    canPlay?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    step: 1,
    canPlay: false,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
    (e: 'next'): void
  }>()

  const isPlaying = ref(true)
  const sliderTimer = ref()
  const sliderInterval = 1000

  const tickVals = computed(() => props.ticks.map(({ val }) => val))

  const handleChange = (ev: Event) => emit('update:modelValue', +(ev.target as HTMLInputElement).value)

  const play = () => {
    if (isPlaying.value) {
      // pause()
      sliderTimer.value = setTimeout(() => {
        emit('next')
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
  .slider-thumb::-webkit-slider-thumb {
    @apply appearance-none bg-skin-button w-3 h-3 rounded-full cursor-pointer;
  }

  .slider-thumb::-webkit-slider-thumb:hover {
    @apply bg-skin-button-accent;
  }
</style>
