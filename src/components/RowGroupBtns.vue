<template>
  <div class="inline-flex" role="group">
    <button
      v-for="d in items"
      :key="d.val"
      :class="[
        d.val === modelValue
          ? 'bg-gray-200 text-gray-900'
          : 'cursor-pointer bg-gray-500 text-gray-200 hover:bg-gray-200 hover:text-gray-500',
      ]"
      @click.prevent="modelValue = d.val"
      class="flex justify-center p-1 border-r border-gray-200 first:rounded-l-lg first:pl-3 first:border-r first:border-gray-200 last:rounded-r-lg last:pr-3"
      type="button"
    >
      {{ d.text }}
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number, U extends ButtonProps<T>">
  export type ButtonProps<T> = {
    val: T
    text: string
  }

  defineProps<{
    items: U[]
  }>()

  const modelValue = defineModel<T>({ required: true })
</script>
