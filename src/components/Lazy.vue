<template>
  <component :is="as" ref="lazyEl">
    <slot v-if="isLoaded" />
  </component>
</template>

<script setup lang="ts">
  import { useIntersectionObserver } from '@vueuse/core'
  import { onMounted, ref } from 'vue'

  withDefaults(
    defineProps<{
      as?: string
    }>(),
    { as: 'div' }
  )

  const lazyEl = ref()
  const isLoaded = ref(false)

  const loadElement = () => (isLoaded.value = true)

  onMounted(() => {
    if (!isLoaded.value) {
      const { stop } = useIntersectionObserver(lazyEl, ([{ isIntersecting }]) => {
        if (isIntersecting) {
          loadElement()
          stop()
        }
      })
    }
  })
</script>
