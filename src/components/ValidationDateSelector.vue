<template>
  <Selector
    v-if="isSuccess"
    :model-value="activeItem"
    :items="items"
    @update:model-value="handleItemChange"
    trigger-class="inline-flex min-w-16 items-center justify-between rounded-lg text-sm md:text-base bg-white text-gray-900 py-2 px-3 shadow-md ring-gray-700 ring-1"
    content-class="min-w-24 bg-white rounded-lg border shadow-sm text-xs md:text-sm"
    item-class="text-xs md:text-sm leading-none flex w-full items-center pl-7 pr-2 py-2 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-400 data-[highlighted]:text-gray-200 data-[state=checked]:text-blue-400"
  />
</template>

<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query'
  import axios from 'axios'
  import { ref, computed, toRefs } from 'vue'

  import { format, isSameMonth, isSameYear, parse, subDays } from 'date-fns'

  import { setSelectedDate } from '@/stores/validation'

  import Selector from '@/components/ui/Selector.vue'

  const props = withDefaults(
    defineProps<{
      rangeView?: boolean
    }>(),
    { rangeView: false },
  )
  const { rangeView } = toRefs(props)

  const activeItem = ref()

  const dateFormat = 'MMM d yyyy'

  const { data, isSuccess } = useQuery({
    queryKey: ['validation', 'dates'],
    queryFn: async () => {
      const url = '/api/validation/dates'
      const { data } = await axios.get(url)
      const dates = (<string[]>data)?.map((dt) => parse(dt, 'yyyy-MM-dd', new Date())) ?? <Date[]>[]
      setSelectedDate(dates?.[0])
      activeItem.value = { id: 0, name: toDateString(dates?.[0]) }
      return dates
    },
  })

  const items = computed(() => data.value?.map((d, idx) => ({ id: idx, name: toDateString(d) })) ?? [])

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

  const handleItemChange = (d: { id: number; name: string }) => {
    activeItem.value = d
    setSelectedDate(data.value?.[d.id]!)
  }
</script>
