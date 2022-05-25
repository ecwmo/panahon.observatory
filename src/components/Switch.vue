<template>
  <div class="flex justify-center">
    <label for="toogleButton" class="flex items-center cursor-pointer">
      <div v-if="label" class="px-2">{{ label }}</div>
      <!-- toggle -->
      <div class="relative">
        <input id="toogleButton" type="checkbox" class="hidden" v-model="checked" />
        <!-- path -->
        <div class="toggle-path border rounded-full shadow-inner" :class="[pathClass, { 'opacity-50': !isOn }]"></div>
        <!-- crcle -->
        <div
          class="toggle-circle absolute bg-white rounded-full shadow inset-y-0 left-0"
          :class="[circleClass, { 'translate-x-full': isOn }]"
        ></div>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
  import { ref, watchEffect, toRefs } from 'vue'
  const props = defineProps({
    isOn: { type: Boolean, default: false },
    label: { type: String, default: '' },
    pathClass: { type: String, default: 'w-9 h-5 bg-red-600' },
    circleClass: { type: String, default: 'w-3.5 h-3.5' },
  })

  const emit = defineEmits(['update:isOn'])

  const { isOn } = toRefs(props)

  const checked = ref(isOn.value)

  watchEffect(() => {
    emit('update:isOn', checked.value)
  })
</script>

<style scoped>
  .toggle-path {
    transition: background 0.3s ease-in-out;
  }

  .toggle-circle {
    top: 0.2rem;
    left: 0.25rem;
    transition: all 0.3s ease-in-out;
  }
</style>
