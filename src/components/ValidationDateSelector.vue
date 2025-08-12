<template>
  <SelectRoot v-if="isSuccess" :model-value="selectedDate" @update:model-value="setSelectedDate">
    <SelectTrigger
      class="inline-flex min-w-16 items-center justify-between rounded-lg text-sm md:text-base bg-white text-gray-900 py-2 px-3 shadow-md ring-gray-700 ring-1"
    >
      <SelectValue class="truncate">{{ toDateString(selectedDate) }}</SelectValue>
      <div class="i-mdi-chevron-down w-5 h-5" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent align="center" class="min-w-24 bg-white rounded-lg border shadow-sm text-xs md:text-sm">
        <SelectScrollUpButton class="flex items-center justify-center bg-white text-blue-400 cursor-default">
          <div class="i-mdi-chevron-up w-5 h-5" />
        </SelectScrollUpButton>
        <SelectViewport class="p-1">
          <SelectItem
            v-for="(dt, idx) in data"
            :key="idx"
            :value="dt"
            class="text-xs md:text-sm leading-none flex w-full items-center pl-7 pr-2 py-2 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-400 data-[highlighted]:text-gray-200 data-[state=checked]:text-blue-400"
          >
            <SelectItemIndicator class="absolute left-2 inline-flex items-center justify-center">
              <div class="i-mdi-check w-3 h-3" />
            </SelectItemIndicator>
            <SelectItemText>{{ toDateString(dt) }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
        <SelectScrollDownButton class="flex items-center justify-center bg-white text-blue-400 cursor-default">
          <div class="i-mdi-chevron-down w-5 h-5" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query'
  import axios from 'axios'
  import { toRefs } from 'vue'

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
  import { useStore } from '@nanostores/vue'
  import { format, isSameMonth, isSameYear, parse, subDays } from 'date-fns'

  import { $selectedDate, setSelectedDate } from '@/stores/validation'

  const props = withDefaults(
    defineProps<{
      rangeView?: boolean
    }>(),
    { rangeView: false },
  )
  const { rangeView } = toRefs(props)

  const selectedDate = useStore($selectedDate)

  const dateFormat = 'MMM d yyyy'

  const { data, isSuccess } = useQuery({
    queryKey: ['validation', 'dates'],
    queryFn: async () => {
      const url = '/api/validation/dates'
      const { data } = await axios.get(url)
      const dates = (<string[]>data)?.map((dt) => parse(dt, 'yyyy-MM-dd', new Date())) ?? <Date[]>[]
      setSelectedDate(dates?.[0])
      return dates
    },
  })

  const toDateRangeString = (d: Date) => {
    const d2 = subDays(d, 5)
    if (isSameYear(d, d2)) {
      if (isSameMonth(d, d2)) {
        return `${format(d2, 'MMM d')} - ${format(d, 'd yyyy')}`
      }
      return `${format(d2, 'MMM d')} - ${format(d, 'MMM d yyyy')}`
    }
    return `${format(d2, 'MMM d yyyy')} - ${format(d, 'MMM d yyyy')}`
  }

  const toDateString = (d: Date) => (rangeView.value ? toDateRangeString(d) : format(d, dateFormat))
</script>
