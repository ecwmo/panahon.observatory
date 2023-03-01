<template>
  <div class="flex flex-col-reverse md:flex-row py-2 md:py-4 justify-center">
    <div class="flex flex-col">
      <!-- Scenario -->
      <div class="flex flex-col items-center space-y-2 px-6">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Scenario</h3>
        <RowGroupBtns v-model:activeBtn="climStore.activeScenario" class="text-xs" :buttons="climStore.scenarios" />
      </div>
      <!-- Variables -->
      <div class="flex flex-col items-center space-y-2 px-6 min-w-max w-2/5 md:w-full mx-auto">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Variable</h3>
        <Button
          v-for="climVar in climStore.variables"
          :key="climVar.val"
          :is-active="climVar.val === climStore.activeVariable.val"
          class="w-40 flex justify-center text-center font-bold py-2 px-4 rounded"
          @click.prevent="climStore.activeVariable = climVar"
          >{{ climVar.text }}</Button
        >
      </div>
    </div>
    <div class="flex flex-col items-center gap-2 w-full">
      <h2 class="text-center font-semibold text-2xl md:text-3xl">Climate Anomaly</h2>
      <Range
        v-model.number="climStore.activeDecade"
        :ticks="climStore.decades.map((d) => ({ val: d[0], text: `${d[0]}` }))"
        :step="10"
        :can-play="true"
        class="max-w-lg w-full md:w-9/12 scale-[.8]"
        @next="handleNext"
      />
      <div class="max-w-lg">
        <Transition name="fade" mode="out-in">
          <img
            :key="`${climStore.activeScenario.val}.${climStore.activeVariable.val}`"
            class="shadow-md rounded-2xl"
            :src="climStore.activeImg"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const climStore = useClimateStore()

  const handleNext = (nextIdx: number) => {
    climStore.$patch({ activeDecade: climStore.decades[nextIdx][0] })
  }
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
