<template>
  <button :type="type">
    <slot>Ok</slot>
  </button>
</template>

<script setup lang="ts">
  import { ButtonHTMLAttributes } from 'vue'

  withDefaults(
    defineProps<{
      type?: ButtonHTMLAttributes['type']
    }>(),
    {
      type: 'button',
    }
  )
</script>
