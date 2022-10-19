import { defineStore } from 'pinia'

import { imgSrcArr } from '@/schemas/forecast'

export const useForecastStore = defineStore('validation', () => {
  const fcstTimes = [
    { val: 24, text: '24hr' },
    { val: 48, text: '48hr' },
    { val: 72, text: '72hr' },
    { val: 96, text: '96hr' },
    { val: 120, text: '120hr' },
  ]

  const metFields = [
    {
      val: 'rain',
      text: 'Daily Rainfall',
    },
    { val: 'temp', text: 'Temperature' },
    {
      val: 'hix',
      text: 'Max Heat Index',
    },
    { val: 'rh', text: 'Relative Humidity' },
    { val: 'wind', text: 'Winds' },
    {
      val: 'wrf-ts',
      text: 'Hourly Forecasts',
      headerName: 'Hourly Forecasts',
    },
    {
      val: 'wpd',
      text: 'Wind Power Forecast',
    },
    {
      val: 'ppv',
      text: 'Solar Power Forecast',
    },
  ]

  const { data: modelImgs } = useQuery(['modelImgs'], async () => {
    const dat = await axios('api/forecast.php?img').then(({ data }) => imgSrcArr.parse(data))
    return dat
  })

  const activeFcstTime = ref(fcstTimes[0])
  const activeVariable = ref(metFields[0])

  return {
    modelImgs,
    fcstTimes,
    metFields,
    activeFcstTime,
    activeVariable,
  }
})
