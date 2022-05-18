<template>
  <div
    :class="[isActive ? 'bg-blue-600 text-gray-900' : 'bg-blue-300 text-gray-800']"
    class="relative flex flex-col justify-center cursor-pointer py-1.5 md:py-3 px-1 md:px-2 border border-black w-52"
  >
    <div class="flex justify-evenly">
      <div class="flex items-center">
        <i :class="`${data.iconClass} text-4xl md:text-5xl`"></i>
      </div>
      <div class="flex flex-col">
        <div class="text-base md:text-lg">{{ data.title }}</div>
        <div class="flex justify-evenly items-end gap-1">
          <div v-show="data.label1" class="text-base md:text-lg font-light">{{ data.label1 }}</div>
          <div class="text-2xl md:text-4xl font-bold ml-1 md:ml-1.5">{{ data.value1 }}</div>
        </div>
        <div v-show="data.value2" class="flex justify-center items-center">
          <div v-show="data.label2" class="flex flex-col text-sm font-light pb-0.5">{{ data.label2 }}</div>
          <div v-show="data.iconClass2"><i :class="`${data.iconClass2} text-lg md:text-xl`"></i></div>
          <div class="text-xl md:text-2xl font-bold ml-1 md:ml-1.5">{{ data.value2 }}</div>
        </div>
      </div>
    </div>
    <div
      class="hidden md:flex items-center justify-center absolute right-2 top-2 shadow-lg w-5 h-5 text-xs stroke-current text-gray-800 hover:text-gray-900 hover:bg-blue-300 rounded-full"
      v-show="isActive"
      @mouseover="showPopup = true"
      @mouseout="showPopup = false"
    >
      <i class="fas fa-info"></i>
      <Popup class="w-32 px-3 py-2 text-center text-xs rounded-lg pointer-events-none" :show="showPopup"
        ><slot></slot
      ></Popup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType, ref } from 'vue'

  import Popup from '@/components/Popup.vue'

  interface CardData {
    title: string
    label1?: string
    value1: string
    label2?: string
    value2?: string
    iconClass: string
    iconClass2?: string
  }

  const props = defineProps({
    data: { type: Object as PropType<CardData>, required: true },
    isActive: { type: Boolean, default: false },
  })

  const showPopup = ref(false)
</script>
