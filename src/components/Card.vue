<template>
  <FakeCard v-if="isLoading" />
  <div
    v-else-if="data?.value1"
    :class="[
      isActive
        ? 'bg-card-defaultHover text-card-Dark'
        : 'cursor-pointer bg-card-defaultBg text-card-defaultHover hover:bg-card-defaultHover hover:text-card-defaultBg',
    ]"
    class="relative flex flex-col justify-center cursor-pointer py-1.5 md:py-3 px-1 md:px-2 h-32 w-52 md:w-60 bg-card-defaultBg"
    data-test="card"
  > <!-- determines if card is active or grayed out -->


    <div class="flex justify-evenly items-center"> <!-- layout of each card -->
      <div data-test="card-icon">
        <slot name="icon1"></slot>
      </div>
      <div class="flex flex-col" data-test="card-info">
        <div v-if="data.title" class="text-base md:text-lg" data-test="card-info-title">{{ data.title }}</div>
        <div v-if="data.value1" class="flex justify-evenly items-end" data-test="card-info-detail1">
          <div v-if="data.label1" class="text-base md:text-lg font-light" data-test="card-info-label1">
            {{ data.label1 }}
          </div>
          <div class="text-2xl md:text-4xl font-bold" data-test="card-info-value1">{{ data.value1 }}</div>
        </div>
        <div
          v-if="data.value2"
          class="flex justify-center items-center space-x-1 md:space-x-1.5"
          data-test="card-info-detail2"
        >
          <div v-if="data.label2" class="text-sm font-light -ml-6" data-test="card-info-label2">
            {{ data.label2 }}
          </div>
          <div data-test="card-icon2">
            <slot name="icon2"></slot>
          </div>
          <div class="text-xl md:text-2xl font-bold" data-test="card-info-value2">{{ data.value2 }}</div>
        </div>
      </div>
    </div>
    <div
      v-show="isActive"
      class="hidden md:flex items-center justify-center absolute right-2 top-2 shadow-lg w-5 h-5 text-xs stroke-current text-card-Light hover:text-card-Dark hover:bg-card-iHover rounded-full"
      @mouseover="showPopup = true"
      @mouseout="showPopup = false"
      data-test="card-info-popup"
    > <!-- i icon at top right of card -->
      <div class="i-fa-solid-info text-xs scale-75" />
      <Popup class="w-32 px-3 py-2 text-center text-xs rounded-lg pointer-events-none" :show="showPopup">
        <slot></slot>
      </Popup>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends CardProps">
  import { ref } from 'vue'

  import FakeCard from '@/components/FakeCard.vue'
  import Popup from '@/components/Popup.vue'

  export type CardProps = {
    title: string
    label1?: string
    value1: string
    label2?: string
    value2?: string
  }

  withDefaults(
    defineProps<{
      data: T
      isActive?: boolean
      isLoading?: boolean
    }>(),
    {
      isActive: false,
      isLoading: true,
    },
  )

  const showPopup = ref(false)
</script>
