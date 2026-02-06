<template>
  <div class="flex flex-col-reverse md:flex-row py-2 md:py-4 justify-center">
    <div class="flex flex-col">
      <!-- Forecast Interval -->
      <Transition name="fade" mode="out-in">
        <div v-if="isMultTime" class="flex flex-col items-center space-y-2 px-6">
          <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Interval</h3>
          <RowGroupBtns v-model="timestep" :items="imageTimesteps" class="text-xs" />
        </div>
      </Transition>
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
          v-if="isMultTime"
          v-model.number="activeTSIdx"
          :ticks="ticks"
          :min-val="0"
          :max-val="120 / timestep - 1"
          :step="1"
          :can-play="true"
          class="max-w-lg w-full md:w-9/12 scale-[.8]"
        />
      </Transition>
      <Transition name="fade" mode="out-in">
        <Selector
          v-if="isMultLoc"
          :items="locNames"
          v-model="locName"
          trigger-class="inline-flex min-w-16 items-center justify-between rounded-lg text-sm md:text-base bg-white text-gray-900 py-2 px-3 shadow-md ring-gray-700 ring-1"
          content-class="min-w-24 bg-white rounded-lg border shadow-sm text-xs md:text-sm"
          item-class="text-xs md:text-sm leading-none flex w-full items-center pl-7 pr-2 py-2 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-400 data-[highlighted]:text-gray-200 data-[state=checked]:text-blue-400"
        />
      </Transition>
      <Transition name="fade">
        <div v-show="activeExtremeVariable" class="flex items-center gap-1.5">
          <SwitchRoot
            v-model="isExtreme"
            class="w-8.5 h-5 shadow-sm flex data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-gray-500 border border-gray-800 data-[state=checked]:border-gray-500 rounded-full relative transition-[background] focus-within:outline-none focus-within:border-gray-600 focus-within:shadow-gray-600"
          >
            <SwitchThumb
              class="w-3.5 h-3.5 my-auto data-[state=checked]:bg-gray-200 data-[state=unchecked]:bg-gray-500 text-xs flex items-center justify-center shadow-xl rounded-full transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-full"
            />
          </SwitchRoot>
          <label class="text-sm">Show extreme</label>
        </div>
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
  import Selector from '@/components/ui/Selector.vue'
  import { SwitchRoot, SwitchThumb } from 'reka-ui'

  import type { MetField } from '@/stores/model'
  import { imageTimesteps, metFields, locationNames } from '@/stores/model'

  const activeVariable = ref(metFields[0])
  const activeTSIdx = ref(0)
  const timestep = ref(imageTimesteps[1].val)
  const locName = ref({ id: 0, name: locationNames[0] })
  const isExtreme = ref(false)

  const defaultHeaderName = 'Model Forecast Maps'
  const showCaption = ref(false)

  const headerName = computed(() => activeVariable.value.headerName ?? defaultHeaderName)

  const isMultTime = computed(() => activeVariable.value?.multTime !== false)
  const isMultLoc = computed(() => !!activeVariable.value.multLoc)

  const locNames = computed(() => locationNames.map((loc, idx) => ({ id: idx, name: loc })))

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

  type FetchModelImageOpts = {
    varName: string
    timestep?: number
    timeIdx?: number
    locName?: string
  }
  const fetchModelImage = async ({ varName, timestep, timeIdx, locName }: FetchModelImageOpts) => {
    const path =
      timestep !== undefined
        ? `${timestep}/${varName}/${timeIdx}`
        : locName !== undefined
          ? `${locName}/${varName}`
          : varName
    const { data } = await axios.get(`/api/models/img/${path}`)
    const imgSrc = z.string().parse(data)
    const initTimestamp = parseDateFromImageFile(imgSrc)
    const imgTimestamp =
      timeIdx !== undefined && timestep !== undefined ? addHours(initTimestamp, timeIdx * timestep) : initTimestamp
    const relTimestamp = formatRelative(imgTimestamp, new Date())
    return {
      src: imgSrc,
      alt: `Model ${varName} for ${relTimestamp}`,
    }
  }

  const queries = computed(() => {
    const n = 120 / timestep.value
    if (isMultTime.value) {
      return Array.from({ length: 3 }, (_, i) => {
        const index = (i + activeTSIdx.value) % n
        return {
          queryKey: ['models', 'images', { varName: activeVariableName.value, timestep, index }],
          queryFn: () =>
            fetchModelImage({ varName: activeVariableName.value, timestep: timestep.value, timeIdx: index }),
        }
      })
    } else if (isMultLoc.value) {
      return [
        {
          queryKey: ['models', 'images', { varName: activeVariableName.value, locName: locName.value.name }],
          queryFn: () => fetchModelImage({ varName: activeVariableName.value, locName: locName.value.name }),
        },
      ]
    } else {
      return [
        {
          queryKey: ['models', 'images', { varName: activeVariableName.value }],
          queryFn: () => fetchModelImage({ varName: activeVariableName.value }),
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
