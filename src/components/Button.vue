<template>
  <div
    class="text-skin-inverted"
    :class="
      isActive
        ? 'bg-skin-button-inv'
        : 'cursor-pointer bg-skin-button hover:bg-skin-button-accent hover:text-skin-button-accent'
    "
  >
    {{ label }}
  </div>
</template>

<script setup lang="ts">
  defineProps({
    label: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  })
</script>
