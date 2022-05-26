import { defineStore } from 'pinia'

import { Station } from '@/types/station'

export const useStationStore = defineStore('station', () => {
  const station = ref(<Station>{})
  const { formatDate: _formatDate } = useDate()

  const update = (newData?: Station) => {
    if (newData) station.value = newData
  }

  const stationName = computed(() => station.value.name)
  const timestamp = computed(() => new Date(station.value?.obs?.timestamp ?? Date.now()))

  const dateString = (format = 'MMMM d, yyyy h:00 bbb') => _formatDate(format, timestamp.value)

  return { station, update, stationName, timestamp, dateString }
})
