<template>
  <div class="flex flex-col-reverse md:flex-row py-2 md:py-4 justify-center">
    <div class="flex flex-col">
      <!-- Forecast Interval -->
      <div class="flex flex-col items-center space-y-2 px-6">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Interval</h3>
        <RowGroupBtns v-model="timestep" :items="imageTimesteps" class="text-xs" />
      </div>
      <!-- Fields -->
      <div class="flex flex-col items-center space-y-2 px-6 min-w-max w-2/5 md:w-full mx-auto">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Fields</h3>
        <button
          v-for="mf in metFields"
          :key="mf.val"
          :class="
            mf.val === activeVariable.val
              ? 'bg-gray-200 text-gray-900'
              : 'cursor-pointer bg-gray-500 text-gray-200 hover:bg-gray-200 hover:text-gray-500'
          "
          @click.prevent="handleVariableChange(mf)"
          class="w-full flex justify-center font-bold py-2 px-4 rounded"
          type="button"
        >
          {{ mf.text }}
        </button>
      </div>
    </div>
    <div class="flex flex-1 flex-col items-center gap-2">
      <h2 class="text-center font-semibold text-2xl md:text-3xl">{{ headerName }}</h2>
      <Transition name="fade" mode="out-in">
        <Range
          v-if="showFcstTime"
          v-model.number="activeTSIdx"
          :ticks="ticks"
          :min-val="0"
          :max-val="120 / timestep - 1"
          :step="1"
          :can-play="true"
          class="max-w-lg w-full md:w-9/12 scale-[.8]"
        />
      </Transition>
      <Transition name="fade">
        <SwitchGroup v-show="activeExtremeVariable" class="scale-75 md:scale-100">
          <div class="flex items-center gap-1.5">
            <Switch
              v-model="isExtreme"
              :class="isExtreme ? 'bg-gray-500' : 'bg-gray-200'"
              class="relative inline-flex h-4 w-8 items-center rounded-full transition-colors ring-1 ring-gray-700 ring-offset-1"
            >
              <span
                :class="isExtreme ? 'translate-x-4 bg-gray-200' : 'bg-gray-500 translate-x-0'"
                class="inline-block h-3.5 w-3.5 transform rounded-full transition-transform"
              />
            </Switch>
            <SwitchLabel class="text-sm">Show extreme</SwitchLabel>
          </div>
        </SwitchGroup>
      </Transition>
      <Transition name="fade" mode="out-in">
        <img
          :key="`${timestep}.${activeVariable.val}.${isExtreme ? 'x' : ''}`"
          class="shadow-md rounded-2xl"
          :src="imageQueries[0].data?.src"
          :alt="imageQueries[0].data?.alt"
          height="650"
          :width="activeVariable.val === 'wrf-ts' ? 800 : 500"
          @load="handleImageLoad"
        />
      </Transition>
      <div v-show="showCaption">
        <ModelCaption
          :id="activeVariableName"
          class="italic text-xs md:text-sm mx-2 md:mx-5 font-medium text-justify self-center break-words md:break-normal w-11/12"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useQueries } from '@tanstack/vue-query'
  import axios from 'axios'
  import { addHours, format, formatRelative, parse } from 'date-fns'
  import { computed, ref } from 'vue'
  import { z } from 'zod'

  import ModelCaption from '@/components/ModelCaption.vue'
  import Range from '@/components/Range.vue'
  import RowGroupBtns from '@/components/RowGroupBtns.vue'
  import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

  import type { MetField } from '@/stores/model'
  import { imageTimesteps, metFields } from '@/stores/model'

  const activeVariable = ref(metFields[0])
  const activeTSIdx = ref(0)
  const timestep = ref(imageTimesteps[1].val)
  const isExtreme = ref(false)

  const defaultHeaderName = 'Model Forecast Maps'
  const showCaption = ref(false)

  const headerName = computed(() => activeVariable.value.headerName ?? defaultHeaderName)

  const showFcstTime = computed(() => activeVariable.value.mult !== false)

  const activeExtremeVariable = computed(() =>
    typeof activeVariable.value.extVal === 'object'
      ? activeVariable.value.extVal?.[timestep.value]
      : activeVariable.value.extVal,
  )

  const activeVariableName = computed(() =>
    !isExtreme.value ? activeVariable.value.val : (activeExtremeVariable.value ?? activeVariable.value.val),
  )

  const parseDateFromImageFile = (s?: string) => {
    const dtStr = `${s?.match(/_([\d_-]+)/)?.[1]} +08`
    return parse(dtStr, 'yyyy-MM-dd_H X', new Date())
  }

  const fetchModelImage = async (varName: string, timestep?: number, index?: number) => {
    const path = timestep !== undefined ? `${timestep}/${varName}/${index}` : varName
    const { data } = await axios.get(`/api/models/img/${path}`)
    const imgSrc = z.string().parse(data)
    const initTimestamp = parseDateFromImageFile(imgSrc)
    const imgTimestamp =
      index !== undefined && timestep !== undefined ? addHours(initTimestamp, index * timestep) : initTimestamp
    const relTimestamp = formatRelative(imgTimestamp, new Date())
    return {
      src: imgSrc,
      alt: `Model ${varName} for ${relTimestamp}`,
    }
  }

  const queries = computed(() => {
    const n = 120 / timestep.value
    if (activeVariable.value.mult !== false) {
      return Array.from({ length: 3 }, (_, i) => {
        const index = (i + activeTSIdx.value) % n
        return {
          queryKey: ['models', 'images', { varName: activeVariableName.value, timestep, index }],
          queryFn: () => fetchModelImage(activeVariableName.value, timestep.value, index),
        }
      })
    } else {
      return [
        {
          queryKey: ['models', 'images', { varName: activeVariableName.value }],
          queryFn: () => fetchModelImage(activeVariableName.value),
        },
      ]
    }
  })

  const imageQueries = useQueries({ queries })

  const ticks = computed(() => {
    const n = 120 / timestep.value
    const skip = 24 / timestep.value
    let items = {}
    if (!imageQueries.value[0].isSuccess) {
      return items
    }
    const initDate = parseDateFromImageFile(imageQueries.value[0].data?.src)
    for (let t = 0; t < n; t++) {
      const dt = addHours(initDate, t * timestep.value)
      items = {
        ...items,
        [t]: { label: !(t % skip) ? format(dt, 'MMM dd') : undefined, popup: format(dt, 'MMM dd h aaa') },
      }
    }
    return items
  })

  const handleImageLoad = () => {
    showCaption.value = true
  }

  const handleVariableChange = (mf: MetField) => {
    showCaption.value = false
    activeVariable.value = mf
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
