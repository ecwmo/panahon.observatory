<template>
  <TabsRoot :model-value="selectedTab" @update:model-value="updateSelectedTab">
    <TabsList class="flex space-x-2 rounded-xl p-1 z-40">
      <TabsTrigger
        v-for="(t, idx) in tabs"
        :key="t"
        :class="[
          'rounded-lg p-2.5 text-sm font-medium leading-5 text-blue-700',
          'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
          selectedTab === idx ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
        ]"
        :value="idx"
      >
        {{ t }}
      </TabsTrigger>
    </TabsList>
  </TabsRoot>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { TabsList, TabsRoot, TabsTrigger } from 'reka-ui'

  const tabs = ['Maps', 'Timeseries']

  const props = withDefaults(
    defineProps<{
      tab?: string
    }>(),
    { tab: '0' },
  )

  const selectedTab = ref(0)

  const updateSelectedTab = (idx: number) => {
    if (idx === 1) {
      location.href = '/validation/ts'
    } else {
      location.href = '/validation'
    }
  }

  onMounted(() => {
    switch (props.tab) {
      case 'ts':
        selectedTab.value = 1
        break
      default:
        selectedTab.value = 0
    }
  })
</script>
