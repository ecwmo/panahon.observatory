<template>
  <div class="flex flex-row text-xs">
    <Button
      v-for="(btn, i) in buttons"
      :key="btn.val"
      :is-active="btn.val === activeBtn?.val"
      class="flex justify-center p-1"
      :class="{
        'rounded-l-lg pl-3 border-r border-gray-200': i === 0,
        'rounded-r-lg pr-3': i === nbuttons - 1,
        'border-r border-gray-200': i > 0 && i < nbuttons - 1,
      }"
      @click.prevent="$emit('update:activeBtn', btn)"
      >{{ btn.text }}</Button
    >
  </div>
</template>

<script setup lang="ts">
  interface Button {
    val: number | string
    text: string
  }

  const props = defineProps<{ buttons: Button[]; activeBtn: Button }>()

  defineEmits(['update:activeBtn'])

  const { buttons } = toRefs(props)

  const nbuttons = computed(() => buttons.value?.length)
</script>
