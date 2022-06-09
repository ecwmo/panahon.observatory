<template>
  <div class="flex flex-row text-xs">
    <Button
      v-for="(btn, i) in buttons"
      :key="btn.val"
      :label="btn.text"
      :isActive="btn.val === activeBtn?.val"
      class="flex text-gray-200 justify-center p-1"
      :class="{
        'rounded-l-lg pl-3': i === 0,
        'rounded-r-lg pr-3': i === nbuttons - 1,
        'border-l border-r border-gray-200': i > 0 && i < nbuttons - 1,
      }"
      @click="$emit('update:activeBtn', btn)"
    />
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
  })

  const emit = defineEmits(['update:activeBtn'])

  const { buttons } = toRefs(props)

  const nbuttons = computed(() => buttons.value?.length)
</script>
