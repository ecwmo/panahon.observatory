<template>
  <div class="flex flex-row text-xs">
    <Button
      v-for="(btn, i) in buttons"
      :key="btn.val"
      :label="btn.text"
      :is-active="btn.val === activeBtn?.val"
      class="flex text-skin-inverted justify-center p-1"
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
  interface Button {
    val: number | string
    text: string
  }

  const props = defineProps<{ buttons: Button[]; activeBtn: Button }>()

  defineEmits(['update:activeBtn'])

  const { buttons } = toRefs(props)

  const nbuttons = computed(() => buttons.value?.length)
</script>
