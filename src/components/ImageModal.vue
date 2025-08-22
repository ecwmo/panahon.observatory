<template>
  <DialogRoot v-model:open="model">
    <DialogPortal>
      <DialogOverlay class="data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
      <DialogContent
        class="mx-auto max-h-fit w-full md:w-[90vw] md:max-w-2xl fixed inset-0 z-100 top-[15%] md:top-[10%]"
        tabindex="0"
        @keyup.up="$emit('up')"
        @keyup.right="$emit('right')"
        @keyup.down="$emit('down')"
        @keyup.left="$emit('left')"
      >
        <div
          class="flex relative justify-center items-center md:p-10 drop-shadow-lg backdrop-blur-sm backdrop-opacity-70 rounded-lg"
        >
          <div class="hidden md:block md:absolute md:top-2 cursor-pointer group" @click.prevent="$emit('up')">
            <div
              class="i-fa6-solid-chevron-up scale-75 text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl"
            />
          </div>

          <div class="hidden md:block md:absolute md:left-2 cursor-pointer group" @click.prevent="$emit('left')">
            <div
              class="i-fa6-solid-chevron-left scale-75 text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl"
            />
          </div>

          <div ref="img-el">
            <slot />
          </div>

          <div class="hidden md:block md:absolute md:right-2 cursor-pointer group" @click.prevent="$emit('right')">
            <div
              class="i-fa6-solid-chevron-right scale-75 text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl"
            />
          </div>

          <div class="hidden md:block md:absolute md:bottom-2 cursor-pointer group" @click.prevent="$emit('down')">
            <div
              class="i-fa6-solid-chevron-down scale-75 text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl"
            />
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
  import { DialogRoot, DialogPortal, DialogOverlay, DialogContent } from 'reka-ui'
  import { useSwipe } from '@vueuse/core'
  import { useTemplateRef } from 'vue'

  const model = defineModel({ default: false })

  const emit = defineEmits(['left', 'right', 'up', 'down'])

  const imgEl = useTemplateRef('img-el')

  useSwipe(imgEl, {
    onSwipeEnd(e: TouchEvent, direction: string) {
      emit(direction.toLowerCase() as Parameters<typeof emit>[0])
    },
  })
</script>
