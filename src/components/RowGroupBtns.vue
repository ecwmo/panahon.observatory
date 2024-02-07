<template>
  <div class="inline-flex" role="group">
    <button
      v-for="(d, i) in items"
      :key="d.val"
      :class="[
        d.val === activeItem?.val
          ? 'bg-gray-200 text-gray-900'
          : 'cursor-pointer bg-gray-500 text-gray-200 hover:bg-gray-200 hover:text-gray-500',
        {
          'rounded-l-lg pl-3 border-r border-gray-200': i === 0,
          'rounded-r-lg pr-3': i === nbuttons - 1,
          'border-r border-gray-200': i > 0 && i < nbuttons - 1,
        },
      ]"
      @click.prevent="$emit('update:activeItem', d)"
      class="flex justify-center p-1"
      type="button"
    >
      {{ d.text }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    items: ButtonProps[]
    activeItem: ButtonProps
  }>()

  defineEmits<{
    'update:activeItem': [item: ButtonProps]
  }>()

  const nbuttons = computed(() => props.items.length)
</script>
