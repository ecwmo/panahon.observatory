import { defineStore } from 'pinia'

import { Station } from '@/types/station'

export const useStationStore = defineStore('station', () => {
  const station = ref(<Station>{})

  const update = (newData?: Station) => {
    if (newData) station.value = newData
  }

  const stationName = computed(() => station.value.name)
  const timestamp = computed(() => new Date(station.value?.obs?.timestamp ?? Date.now()))
  const { formatDate } = useDate(timestamp.value)
  const dateString = (format = 'MMMM d, yyyy h:00 bbb') => formatDate(format)

  return { station, update, stationName, timestamp, dateString }
})
