<template>
  <div class="absolute bottom-full z-10" :class="bgTheme">
    <slot></slot>
    <svg
      class="absolute h-2 w-full left-0 top-full"
      :class="theme2"
      x="0px"
      y="0px"
      viewBox="0 0 255 255"
      xml:space="preserve"
    >
      <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
    </svg>
  </div>
</template>

<script setup lang="ts">
  import { toRefs, computed } from 'vue'

  const props = defineProps({
    theme: { type: String, default: 'bg-black text-black text-white' },
  })

  const { theme } = toRefs(props)

  const bgTheme = computed(() => {
    const colors = theme.value.split(' ')
    const bgColor = colors.filter((c) => c.includes('bg-'))?.[0] ?? 'bg-black'
    const txtColor =
      colors.filter((c) => c.includes('text-') && c !== `text-${bgColor.split('-').slice(1).join('-')}`)?.[0] ??
      'text-white'
    return `${bgColor} ${txtColor}`
  })
  const theme2 = computed(() => {
    const colors = bgTheme.value.split(' ')
    return theme.value.split(' ').filter((c) => colors.indexOf(c) === -1)?.[0] ?? 'text-white'
  })
</script>
