<template>
  <div class="flex flex-row text-xs">
    <div
      v-for="(btn, i) in buttons"
      :key="btn.text"
      class="flex text-gray-200 justify-center p-1"
      :class="[
        {
          'rounded-l-lg pl-3': i === 0,
          'rounded-r-lg pr-3': i === nbuttons - 1,
          'border-l border-r border-gray-200': i > 0 && i < nbuttons - 1,
        },
        btn.val === activeBtn?.val ? activeClass : defaultClass,
      ]"
      @click="$emit('update:activeBtn', btn)"
    >
      {{ btn.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from 'vue'

  interface Button {
    val: number | string
    text: string
  }

  const props = defineProps({
    buttons: { type: Object as PropType<Button[]>, default: [] },
    activeBtn: { type: Object as PropType<Button> },
    defaultClass: { type: String, default: 'cursor-pointer bg-gray-700 hover:bg-gray-500 hover:text-white' },
    activeClass: { type: String, default: 'bg-blue-600' },
  })

  const emit = defineEmits(['update:activeBtn'])

  const { buttons } = toRefs(props)

  const nbuttons = computed(() => buttons.value?.length)
</script>
