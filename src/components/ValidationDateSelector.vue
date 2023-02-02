<template>
  <Listbox v-model="valStore.selectedDate" class="w-fit">
    <div class="relative">
      <ListboxButton
        class="relative w-full cursor-default rounded-md bg-skin-body-fill-inv text-skin-inverted py-1 pl-2 pr-8 text-sm md:text-base text-left shadow-md ring-gray-700 ring-1"
      >
        <span class="block truncate">{{ selectedDate ?? 'Loading...' }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center mx-2">
          <i-fa6-solid-chevron-down class="scale-75" />
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
            v-for="(dt, id) in valStore.validationDates"
            :key="id"
            v-slot="{ active, selected }"
            :value="dt"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-skin-listbox-active text-skin-listbox-active' : 'text-skin-inverted',
                'relative cursor-default select-none py-1 pl-2 sm:pl-8 pr-2',
              ]"
            >
              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                rangeView ? toDateRangeString(dt) : toDateString(dt)
              }}</span>
              <span
                v-if="selected"
                class="hidden sm:flex absolute inset-y-0 left-0 items-center pl-2 text-skin-listbox-active"
              >
                <i-fa-solid-check v-show="selected" class="scale-75" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
  import { format, isSameMonth, isSameYear, subDays } from 'date-fns'
  const props = withDefaults(defineProps<{ rangeView?: boolean }>(), { rangeView: false })
  const valStore = useValidationStore()

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

  const selectedDate = computed(() =>
    props.rangeView ? toDateRangeString(valStore.selectedDate) : format(valStore.selectedDate, dateFormat)
  )
</script>
