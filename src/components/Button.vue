<template>
  <button
    :type="type"
    :class="
      isActive
        ? 'bg-skin-button-active text-skin-button-active'
        : 'cursor-pointer bg-skin-button text-skin-button hover:bg-skin-button-accent hover:text-skin-button-accent'
    "
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
  import { ButtonHTMLAttributes, PropType } from 'vue'
  defineProps({
    type: { type: String as PropType<ButtonHTMLAttributes['type']>, default: 'button' },
    isActive: { type: Boolean, default: false },
  })
</script>
