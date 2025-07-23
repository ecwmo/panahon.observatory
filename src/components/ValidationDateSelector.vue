<template>
  <Listbox v-if="isSuccess" model-value="selectedDate" @update:model-value="setSelectedDate">
    <div class="relative mt-1">
      <ListboxButton
        class="relative w-full cursor-default rounded-md bg-white text-gray-900 py-2 pl-3 pr-10 text-sm md:text-base text-left shadow-md ring-gray-700 ring-1"
      >
        <span>{{ selectedDtStr ?? 'Loading...' }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <div class="i-mdi-unfold-more-horizontal w-5 h-5" />
        </span>
      </ListboxButton>
      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute mt-1 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-xs sm:text-sm shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <ListboxOption
            v-for="(dt, id) in validationDates"
            :key="id"
            v-slot="{ active, selected }"
            :value="dt"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-blue-100 text-blue-700' : 'text-gray-900',
                'relative cursor-default select-none py-1 pl-2 sm:pl-8 pr-2',
              ]"
            >
              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                rangeView ? toDateRangeString(dt) : toDateString(dt)
              }}</span>
              <span v-if="selected" class="hidden sm:flex absolute inset-y-0 left-0 items-center pl-3 text-blue-700">
                <div v-show="selected" clas="i-mdi-check-bold w-4 h-4" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query'
  import axios from 'axios'
  import { computed } from 'vue'

  import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'

  import { useStore } from '@nanostores/vue'
  import { format, isSameMonth, isSameYear, parse, subDays } from 'date-fns'

  import { $selectedDate, setSelectedDate } from '@/stores/validation'

  const props = withDefaults(
    defineProps<{
      rangeView?: boolean
    }>(),
    { rangeView: false },
  )

  const selectedDate = useStore($selectedDate)

  const dateFormat = 'MMM d yyyy'

  const { data: validationDates, isSuccess } = useQuery({
    queryKey: ['validation', 'dates'],
    queryFn: async () => {
      const url = '/api/validation/dates'
      const { data } = await axios.get(url)
      const dates = (<string[]>data)?.map((dt) => parse(dt, 'yyyy-MM-dd', new Date())) ?? <Date[]>[]
      setSelectedDate(dates?.[0])
      return dates
    },
  })

  const toDateString = (d: Date) => format(d, dateFormat)

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

  const selectedDtStr = computed(() =>
    props.rangeView ? toDateRangeString(selectedDate.value) : format(selectedDate.value, dateFormat),
  )
</script>
