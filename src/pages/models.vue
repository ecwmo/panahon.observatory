<template>
  <div class="flex flex-col-reverse md:flex-row py-2 md:py-4 justify-center w-full">
    <div class="flex flex-col">
      <!-- Forecast Length -->
      <div v-show="showFcstTime" class="flex flex-col items-center space-y-2 px-6">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Forecast Length</h3>
        <RowGroupBtns v-model:activeBtn="fcstStore.activeFcstTime" class="text-xs" :buttons="fcstStore.fcstTimes" />
      </div>
      <!-- Fields -->
      <div class="flex flex-col items-center space-y-2 px-6 min-w-max w-2/5 md:w-full mx-auto">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Fields</h3>
        <Button
          v-for="mf in fcstStore.metFields"
          :key="mf.val"
          :is-active="mf.val === fcstStore.activeVariable.val"
          class="w-full flex justify-center font-bold py-2 px-4 rounded"
          @click.prevent="fcstStore.activeVariable = mf"
          >{{ mf.text }}</Button
        >
      </div>
    </div>
    <div class="flex flex-col items-center gap-2 w-full">
      <h2 class="text-center font-semibold text-2xl md:text-3xl">{{ headerName }}</h2>
      <SwitchGroup v-show="varNameX" class="scale-75 md:scale-100">
        <div class="flex items-center gap-1.5">
          <Switch
            v-model="extremeToggle"
            :class="extremeToggle ? 'bg-skin-button' : 'bg-skin-button-accent'"
            class="relative inline-flex h-4 w-8 items-center rounded-full transition-colors ring-1 ring-gray-700 ring-offset-1"
          >
            <span
              :class="extremeToggle ? 'translate-x-4 bg-skin-button-accent' : 'bg-skin-button translate-x-0'"
              class="inline-block h-3.5 w-3.5 transform rounded-full transition-transform"
            />
          </Switch>
          <SwitchLabel class="text-sm">Show extreme</SwitchLabel>
        </div>
      </SwitchGroup>
      <div :class="[fcstStore.activeVariable.val === 'wrf-ts' ? 'max-w-2xl' : 'max-w-lg']">
        <img class="shadow-md rounded-2xl" :src="imgSrc" />
      </div>
      <div
        class="italic text-xs md:text-sm mx-2 md:mx-5 font-medium text-justify self-center break-words md:break-normal model-caption w-11/12"
      >
        <component :is="caption"></component>
      </div>
      <div
        v-show="captionX && extremeToggle"
        class="italic text-xs md:text-sm mx-2 md:mx-5 font-medium text-justify self-center break-words md:break-normal model-caption w-11/12"
      >
        <component :is="captionX"></component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const CaptionModelRainx = defineAsyncComponent({ loader: () => import('@/components/caption/ModelRainx.vue') })
  const CaptionModelHix = defineAsyncComponent({ loader: () => import('@/components/caption/ModelHix.vue') })
  const CaptionModelWpd = defineAsyncComponent({ loader: () => import('@/components/caption/ModelWpd.vue') })
  const CaptionModelPpv = defineAsyncComponent({ loader: () => import('@/components/caption/ModelPpv.vue') })

  const defaultHeaderName = 'Model Forecast Maps'

  const fcstStore = useForecastStore()

  const extremeToggle = ref(false)

  const varNameX = computed(() => (fcstStore.activeVariable.val === 'rain' ? 'rainx' : ''))
  const headerName = computed(() => fcstStore.activeVariable.headerName ?? defaultHeaderName)

  const showFcstTime = computed(() => fcstStore.activeVariable.val !== 'wrf-ts')

  const imgSrc = computed(() => {
    const name = extremeToggle.value && varNameX.value ? varNameX.value : fcstStore.activeVariable.val
    const pattern = !showFcstTime.value ? `${name}_` : `${fcstStore.activeFcstTime.val}hr_${name}_`
    return fcstStore.modelImgs?.find((f: string) => f.includes(pattern))
  })

  const caption = computed(() => {
    if (fcstStore.activeVariable.val === 'hix') return CaptionModelHix
    if (fcstStore.activeVariable.val === 'wpd') return CaptionModelWpd
    if (fcstStore.activeVariable.val === 'ppv') return CaptionModelPpv
    return
  })
  const captionX = computed(() => {
    if (fcstStore.activeVariable.val === 'rain') return CaptionModelRainx
    return
  })
</script>

<style>
  .model-caption a {
    @apply underline text-skin-link;
  }

  .model-caption a:hover {
    @apply underline text-skin-link-active;
  }
</style>
