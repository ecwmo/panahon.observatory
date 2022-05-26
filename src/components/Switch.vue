<template>
  <div class="flex justify-center">
    <label for="toogleButton" class="flex items-center cursor-pointer">
      <div v-if="label" class="px-2">{{ label }}</div>
      <!-- toggle -->
      <div class="relative">
        <input id="toogleButton" type="checkbox" class="hidden" v-model="checked" />
        <!-- path -->
        <div
          class="toggle-path border rounded-full shadow-inner w-9 h-5"
          :class="[bgColor, { 'opacity-50': !isOn }]"
        ></div>
        <!-- crcle -->
        <div
          class="toggle-circle absolute bg-white rounded-full shadow inset-y-0 left-0 w-3.5 h-3.5"
          :class="{ 'translate-x-full': isOn }"
        ></div>
      </div>
      <div v-if="labelRight" class="px-2">{{ labelRight }}</div>
    </label>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isOn: { type: Boolean, default: false },
    label: { type: String, default: '' },
    labelRight: { type: String, default: '' },
    bgColor: { type: String, default: 'bg-red-600' },
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
