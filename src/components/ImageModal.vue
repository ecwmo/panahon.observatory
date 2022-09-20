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
        <DialogPanel class="flex flex-col justify-center items-center h-full">
          <div class="hidden md:block cursor-pointer group" @click.prevent="$emit('up')">
            <i class="fas fa-chevron-up text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl" />
          </div>

          <div class="flex justify-center items-center">
            <div class="hidden md:block cursor-pointer group" @click.prevent="$emit('left')">
              <i class="fas fa-chevron-left text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl" />
            </div>
            <div ref="imgEl" class="max-w-xl p-2">
              <slot />
            </div>
            <div class="hidden md:block cursor-pointer group" @click.prevent="$emit('right')">
              <i class="fas fa-chevron-right text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl" />
            </div>
          </div>

          <div class="hidden md:block cursor-pointer group" @click.prevent="$emit('down')">
            <i class="fas fa-chevron-down text-white opacity-75 group-hover:opacity-100 text-2xl md:text-4xl" />
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  defineProps({
    open: { type: Boolean, default: false },
  })

  const emit = defineEmits(['close', 'left', 'right', 'up', 'down'])

  const imgEl = ref()

  useSwipe(imgEl, {
    onSwipeEnd(e: TouchEvent, direction: string) {
      emit(direction.toLowerCase() as Parameters<typeof emit>[0])
    },
  })
</script>
