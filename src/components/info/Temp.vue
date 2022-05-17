<template>
  <div class="flex flex-col">
    <div>
      {{ tempStr }}
    </div>
    <div class="text-[0.6rem]">{{ `HI: ${hiStr}` }}</div>
  </div>
</template>

<script setup lang="ts">
  import { toRefs, computed } from 'vue'

  const props = defineProps({
    data: { type: Object, required: true },
  })

  const { data } = toRefs(props)

  const tempStr = computed(() => `${data.value['temp']} °C`)
  const hiStr = computed(() => `${data.value['hi']} °C`)

  // const showHi = computed(() => `${data.value['hi']}` !== '--')
</script>
