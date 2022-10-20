import { defineStore } from 'pinia'

import { imgSrcArr } from '@/schemas/forecast'

export const useForecastStore = defineStore('forecast', () => {
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
      extVal: 'rainx',
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
      mult: false,
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

  const isExtreme = ref(false)
  const imgFreq = ref('24hrly')

  const { data: modelImgs } = useQuery(['modelImgs', imgFreq], async () => {
    const dat = await axios(`api/forecast.php?img=${imgFreq.value}`).then(({ data }) =>
      imgSrcArr.parse(data).filter((f) => f.includes('wrf-'))
    )
    return dat
  })

  const activeFcstTime = ref(fcstTimes[0])
  const activeVariable = ref(metFields[0])

  const activeImageGroup = computed(() => {
    const name =
      isExtreme.value && 'extVal' in activeVariable.value ? activeVariable.value.extVal : activeVariable.value.val
    return modelImgs.value?.filter((f) => f.includes(`${name}_`))
  })

  const activeImage = computed(() =>
    activeVariable.value.mult === false
      ? activeImageGroup.value?.[0]
      : activeImageGroup.value?.find((f: string) => f.includes(`${activeFcstTime.value.val}hr_`))
  )

  return {
    modelImgs,
    fcstTimes,
    metFields,
    activeFcstTime,
    activeVariable,
    activeImageGroup,
    activeImage,
    isExtreme,
  }
})
