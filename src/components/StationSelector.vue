<template>
  <div>
    <SelectRoot :model-value="modelValue" @update:model-value="handleChange" by="id">
      <SelectTrigger
        class="inline-flex w-full items-center justify-between rounded-lg text-xs md:text-sm bg-white text-gray-900 px-2 py-1 shadow-md ring-gray-700 ring-1"
      >
        <SelectValue class="truncate">{{ modelValue?.name ?? 'Loading...' }}</SelectValue>
        <div class="i-mdi-chevron-down w-5 h-5" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent align="center" class="w-full min-w-18 bg-white rounded-lg border shadow-sm text-xs md:text-sm">
          <SelectScrollUpButton class="flex items-center justify-center bg-white text-blue-400 cursor-default">
            <div class="i-mdi-chevron-up w-5 h-5" />
          </SelectScrollUpButton>
          <SelectViewport class="p-1">
            <SelectItem
              v-for="stn in stations"
              :key="stn.id"
              :value="stn"
              class="text-xs md:text-sm leading-none flex w-full items-center pl-7 pr-2 py-2 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-400 data-[highlighted]:text-gray-200 data-[state=checked]:text-blue-400"
            >
              <SelectItemIndicator class="absolute left-2 inline-flex items-center justify-center">
                <div class="i-mdi-check w-3 h-3" />
              </SelectItemIndicator>
              <SelectItemText>{{ stn.name }}</SelectItemText>
            </SelectItem>
          </SelectViewport>
          <SelectScrollDownButton class="flex items-center justify-center bg-white text-blue-400 cursor-default">
            <div class="i-mdi-chevron-down w-5 h-5" />
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>

<script setup lang="ts">
  import {
    SelectRoot,
    SelectTrigger,
    SelectValue,
    SelectPortal,
    SelectContent,
    SelectScrollUpButton,
    SelectScrollDownButton,
    SelectViewport,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
  } from 'reka-ui'

  import type { StationObs } from '@/types/station'

  defineProps<{
    modelValue: StationObs
    stations?: StationObs[]
  }>()

  const emit = defineEmits<{
    'update:modelValue': [stn: StationObs]
  }>()

  const handleChange = (stn: StationObs) => {
    emit('update:modelValue', stn)
  }
</script>
