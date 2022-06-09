<template>
  <div class="text-gray-200" :class="isActive ? activeClass : defaultClass">
    {{ label }}
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    label: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    defaultClass: { type: String, default: 'cursor-pointer bg-gray-700 hover:bg-gray-500 hover:text-white' },
    activeClass: { type: String, default: 'bg-blue-600' },
  })
</script>
