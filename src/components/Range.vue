<template>
  <fieldset>
    <input
      :value="modelValue"
      :min="Math.min(...data)"
      :max="Math.max(...data)"
      :step="step"
      type="range"
      class="appearance-none w-full h-0.5 bg-skin-body-fill-inv rounded outline-none slider-thumb"
      @input="handleChange"
    />
    <svg
      class="w-full overflow-visible fill-current text-skin-base"
      role="presentation"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        v-for="(d, i) in data"
        :key="d"
        :x="`${(100 * i) / (data.length - 1)}%`"
        y="1"
        width="0.5"
        height="5"
      ></rect>
      <text
        v-for="(d, i) in data"
        :key="d"
        class="text-xs font-semibold"
        :x="`${(100 * i) / (data.length - 1)}%`"
        y="18"
        text-anchor="middle"
      >
        {{ d }}
      </text>
    </svg>
  </fieldset>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{ modelValue: number; data: number[]; step?: number }>(), {
    modelValue: 0,
    data: () => [],
    step: 1,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
  }>()

  const handleChange = (ev: Event) => emit('update:modelValue', +(ev.target as HTMLInputElement).value)
</script>
