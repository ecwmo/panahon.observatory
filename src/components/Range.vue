<template>
  <fieldset>
    <input
      :value="modelValue"
      :min="Math.min(...data)"
      :max="Math.max(...data)"
      type="range"
      step="10"
      class="appearance-none w-full h-0.5 bg-skin-body-fill-inv rounded outline-none slider-thumb"
      @input="handleChange"
    />
    <svg
      class="w-full px-2 overflow-visible fill-current text-skin-base"
      role="presentation"
      height="5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        v-for="(d, i) in data"
        :key="d"
        class="hidden md:block"
        :x="`${(100 * i) / (data.length - 1)}%`"
        y="3"
        width="0.5"
        height="5"
      ></rect>
    </svg>
    <svg
      class="w-full px-2 overflow-visible md:mt-1 fill-current text-skin-base"
      role="presentation"
      height="10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        v-for="(d, i) in data"
        :key="d"
        class="text-xs font-semibold"
        :class="{ 'hidden md:block': i > 0 && i < data.length - 1 }"
        :x="`${(100 * i) / (data.length - 1)}%`"
        y="10"
        text-anchor="middle"
      >
        {{ d }}
      </text>
    </svg>
  </fieldset>
</template>

<script setup lang="ts">
  import { PropType } from 'vue'

  defineProps({
    modelValue: { type: Number, required: true },
    data: { type: Object as PropType<number[]>, default: [] },
  })

  const emit = defineEmits(['update:modelValue'])

  const handleChange = (ev: Event) => emit('update:modelValue', (ev.target as HTMLInputElement).value)
</script>
