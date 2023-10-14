<template>
  <TabGroup :selected-index="selectedTab" @change="changeTab">
    <TabList class="flex space-x-2 rounded-xl p-1 z-40">
      <Tab v-for="t in tabs" v-slot="{ selected }" :key="t" as="template">
        <button
          :class="[
            'rounded-lg p-2.5 text-sm font-medium leading-5 text-blue-700',
            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
            selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
          ]"
        >
          {{ t }}
        </button>
      </Tab>
    </TabList>
  </TabGroup>
</template>

<script setup lang="ts">
  import { route } from '@/stores/routes'
  const tabs = ['Maps', 'Timeseries']

  const props = withDefaults(
    defineProps<{
      tab?: string
    }>(),
    { tab: '0' }
  )

  const selectedTab = ref(0)

  const changeTab = (idx: number) => {
    selectedTab.value = idx
    if (idx === 1) {
      location.href = route('validation/ts')
    } else {
      location.href = route('validation')
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
