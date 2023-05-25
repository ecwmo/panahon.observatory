<template>
  <div class="inline-flex" role="group">
    <Button
      v-for="(d, i) in items"
      :key="d.val"
      :class="[
        d.val === activeItem?.val
          ? 'bg-skin-button-active text-skin-button-active'
          : 'cursor-pointer bg-skin-button text-skin-button hover:bg-skin-button-accent hover:text-skin-button-accent',
        {
          'rounded-l-lg pl-3 border-r border-gray-200': i === 0,
          'rounded-r-lg pr-3': i === nbuttons - 1,
          'border-r border-gray-200': i > 0 && i < nbuttons - 1,
        },
      ]"
      class="flex justify-center p-1"
      @click.prevent="$emit('update:activeItem', d)"
      >{{ d.text }}</Button
    >
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    items: ButtonProps[]
    activeItem: ButtonProps
  }>()

  defineEmits<{
    'update:activeItem': [item: ButtonProps]
  }>()

  const nbuttons = computed(() => props.items.length)
</script>
