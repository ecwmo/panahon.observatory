<template>
  <div class="flex flex-col-reverse md:flex-row py-2 md:py-4 justify-center">
    <div class="flex flex-col">
      <!-- Scenario -->
      <div class="flex flex-col items-center space-y-2 px-6">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Scenario</h3>
        <RowGroupBtns
          v-model="activeScenarioName"
          :items="scenarios"
          class="text-xs"
          @update:model-value="setActiveScenario"
        />
      </div>
      <!-- Variables -->
      <div class="flex flex-col items-center space-y-2 px-6 min-w-max w-2/5 md:w-full mx-auto">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Variable</h3>
        <button
          v-for="climVar in variables"
          :key="climVar.val"
          :class="
            climVar.val === activeVariable.val
              ? 'bg-gray-200 text-gray-900'
              : 'cursor-pointer bg-gray-500 text-gray-200 hover:bg-gray-200 hover:text-gray-500'
          "
          @click.prevent="setActiveVariable(climVar)"
          class="w-40 flex justify-center text-center font-bold py-2 px-4 rounded"
          type="button"
        >
          {{ climVar.text }}
        </button>
      </div>
    </div>
    <div class="relative flex flex-col items-center gap-2 w-full">
      <div class="absolute top-0 right-0 mr-5">
        <NotificationsContainer client:load /> <!-- notification button -->
      </div>  
      <h2 class="text-center font-semibold text-2xl md:text-3xl">Climate Anomaly</h2>
      <Range
        :model-value="activeDecade"
        @update:model-value="setActiveDecade($event)"
        :ticks="ticks"
        :step="10"
        :can-play="true"
        class="max-w-lg w-full md:w-9/12 scale-[.8]"
      />
      <div class="max-w-lg">
        <Transition name="fade" mode="out-in">
          <img :key="`${activeScenario.val}.${activeVariable.val}`" class="shadow-md rounded-2xl" :src="activeImage" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { computed, ref } from 'vue'

  import Range, { type RangeTicks } from '@/components/Range.vue'
  import RowGroupBtns from '@/components/RowGroupBtns.vue'
  import NotificationsContainer from '@/components/NotificationsContainer.vue'


  import {
    $activeDecade,
    $activeImage,
    $activeScenario,
    $activeVariable,
    decades,
    scenarios,
    setActiveDecade,
    setActiveScenario,
    setActiveVariable,
    variables,
  } from '@/stores/climate'

  const activeScenario = useStore($activeScenario)
  const activeDecade = useStore($activeDecade)
  const activeVariable = useStore($activeVariable)
  const activeImage = useStore($activeImage)
  const activeScenarioName = ref(scenarios[0].val)

  const ticks = computed(() => decades.reduce((o, d) => ({ ...o, [d[0]]: { label: `${d[0]}` } }), {} as RangeTicks))
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
