<template>
  <div v-show="show" class="absolute bottom-full z-10 drop-shadow-md" :class="bgTheme">
    <slot></slot>
    <svg
      class="absolute h-2 w-full left-0 top-full z-20 drop-shadow-md"
      x="0px"
      y="0px"
      viewBox="0 0 255 255"
      xml:space="preserve"
    >
      <polygon :class="svgFill" points="0,0 127.5,127.5 255,0" />
    </svg>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    theme?: string
    show?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    theme: 'bg-skin-body-fill text-skin-base fill-skin-body',
    show: true,
  })

  const { theme } = toRefs(props)

  const bgTheme = computed(() => {
    const colors = theme.value.split(' ')
    const bgColor = colors.find((c) => c.includes('bg-')) ?? 'bg-black'
    const txtColor =
      colors.find((c) => c.includes('text-') && c !== `text-${bgColor.split('-').slice(1).join('-')}`) ?? 'text-white'
    return `${bgColor} ${txtColor}`
  })

  const svgFill = computed(() => {
    return theme.value.split(' ').find((c) => c.includes('fill-')) ?? 'text-white'
  })
</script>
