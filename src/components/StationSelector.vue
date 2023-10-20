<template>
  <div>
    <Listbox v-model="selectedStation" by="id" @update:model-value="handleChange">
      <div class="relative">
        <ListboxButton
          class="relative w-full cursor-default rounded-md bg-white py-1 pl-2 pr-6 text-xs sm:text-sm text-left shadow-md ring-gray-700 ring-1"
        >
          <span class="block truncate">{{ modelValue?.name ?? 'Loading...' }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <div class="i-fa6-solid-chevron-down scale-75" />
          </span>
        </ListboxButton>
        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs sm:text-sm shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <ListboxOption
              v-for="(stn, id) in stations"
              :key="id"
              v-slot="{ active, selected }"
              :value="stn"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-blue-100 text-blue-700' : 'text-gray-900',
                  'relative cursor-default select-none py-1 pl-2 sm:pl-8 pr-2',
                ]"
              >
                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ stn.name }}</span>
                <span v-if="selected" class="hidden sm:flex absolute inset-y-0 left-0 items-center pl-2 text-blue-700">
                  <div v-show="selected" class="i-fa-solid-check scale-75" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
  import type { StationObs } from '@/types/station'

  defineProps<{
    modelValue?: StationObs
    stations?: StationObs[]
  }>()

  const emit = defineEmits(['update:modelValue'])

  const selectedStation = ref()

  const handleChange = (newStation: StationObs) => {
    emit('update:modelValue', newStation)
  }
</script>
