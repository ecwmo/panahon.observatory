<template>
  <Listbox v-model="$selectedDate">
    <div class="relative mt-1">
      <ListboxButton
        class="relative w-full cursor-default rounded-md bg-white text-gray-900 py-2 pl-3 pr-10 text-sm md:text-base text-left shadow-md ring-gray-700 ring-1"
      >
        <span>{{ selectedDtStr ?? 'Loading...' }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <i-mdi-unfold-more-horizontal class="w-5 h-5" />
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
            v-for="(dt, id) in $valDates"
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
              <span
                v-if="selected"
                class="hidden sm:flex absolute inset-y-0 left-0 items-center pl-3 text-blue-700"
              >
                <i-mdi-check-bold v-show="selected" clas="w-4 h-4" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
  import { useStore, useVModel } from '@nanostores/vue'
  import { format, isSameMonth, isSameYear, subDays } from 'date-fns'

  import { selectedDate, validationDates } from '@/stores/validation'

  interface Props {
    rangeView?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { rangeView: false })

  const $valDates = useStore(validationDates)
  const $selectedDate = useVModel(selectedDate)

  const dateFormat = 'MMM d yyyy'

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
    props.rangeView ? toDateRangeString($selectedDate.value) : format($selectedDate.value, dateFormat)
  )
</script>
