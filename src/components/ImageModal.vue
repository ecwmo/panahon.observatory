<template>
  <Dialog :open="open" class="relative z-10" @close="$emit('close')">
    <div class="fixed inset-0 bg-skin-body-fill/40" aria-hidden="true" />
    <div
      class="fixed inset-0"
      tabindex="0"
      @keyup.up="$emit('up')"
      @keyup.right="$emit('right')"
      @keyup.down="$emit('down')"
      @keyup.left="$emit('left')"
    >
      <div class="flex items-center justify-center h-screen">
        <DialogPanel
          class="flex flex-col relative justify-center items-center h-max md:p-10 drop-shadow-lg backdrop-blur-sm backdrop-opacity-75 rounded-lg"
        >
          <div class="hidden md:block md:absolute md:top-0 cursor-pointer group" @click.prevent="$emit('up')">
            <i-fa6-solid-chevron-up
              class="scale-75 text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl"
            />
          </div>

          <div class="hidden md:block md:absolute md:left-0 cursor-pointer group" @click.prevent="$emit('left')">
            <i-fa6-solid-chevron-left
              class="scale-75 text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl"
            />
          </div>

          <div ref="imgEl" class="max-w-xl p-1">
            <slot />
          </div>

          <div class="hidden md:block md:absolute md:right-0 cursor-pointer group" @click.prevent="$emit('right')">
            <i-fa6-solid-chevron-right
              class="scale-75 text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl"
            />
          </div>

          <div class="hidden md:block md:absolute md:bottom-0 cursor-pointer group" @click.prevent="$emit('down')">
            <i-fa6-solid-chevron-down
              class="scale-75 text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl"
            />
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  interface Props {
    open?: boolean
  }

  withDefaults(defineProps<Props>(), { open: false })

  const emit = defineEmits(['close', 'left', 'right', 'up', 'down'])

  const imgEl = ref()

  useSwipe(imgEl, {
    onSwipeEnd(e: TouchEvent, direction: string) {
      emit(direction.toLowerCase() as Parameters<typeof emit>[0])
    },
  })
</script>
