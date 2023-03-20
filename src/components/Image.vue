<template>
  <img ref="img" :data-url="src" :class="[{ 'h-screen': !isLoaded }]" @load="handleLoad" />
</template>

<script setup lang="ts">
  interface Props {
    src: string
    lazy?: boolean
  }
  const props = withDefaults(defineProps<Props>(), { lazy: true })

  const img = ref()
  const isLoaded = ref(false)

  const handleLoad = () => {
    isLoaded.value = true
  }

  const loadImage = () => (img.value.src = img.value.dataset.url ?? '')

  onMounted(() => {
    if (!props.lazy) loadImage()
    else if (props.lazy && !isLoaded.value) {
      const { stop } = useIntersectionObserver(img, ([{ isIntersecting }]) => {
        if (isIntersecting) {
          loadImage()
          stop()
        }
      })
    }
  })
</script>
