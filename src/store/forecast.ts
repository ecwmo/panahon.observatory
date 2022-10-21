import { defineStore } from 'pinia'
import { parse } from 'date-fns'

import { imgSrcArr } from '@/schemas/forecast'

export const useForecastStore = defineStore('forecast', () => {
  const initTime = ref(new Date())
  const fcstTimes = ref([0])
  const activeFcstTime = ref(0)

  const metFields = [
    {
      val: 'rain',
      text: 'Rainfall',
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
  const activeVariable = ref(metFields[0])

  const imageFrequencies = [
    { val: '24hrly', text: '24hr' },
    { val: '3hrly', text: '3hr' },
  ]

  const isExtreme = ref(false)
  const activeImageFrequency = ref(imageFrequencies[1])

  const getForecastInitTime = (imageStr: string) =>
    parse(`${imageStr.match(/[\d]{4}-[\d]{2}-[\d]{2}_[\d]{2}/g)?.[0]} +08` ?? '', 'yyyy-MM-dd_HH x', new Date())

  const { data: modelImgs } = useQuery(['modelImgs', activeImageFrequency], async () => {
    const dat = await axios(`api/forecast.php?img=${activeImageFrequency.value.val}`).then(({ data }) => {
      const dat = imgSrcArr.parse(data).filter((f) => f.includes('wrf-'))

      initTime.value = getForecastInitTime(dat[0])

      const images = dat.filter((f) => f.includes('rain_'))
      const ft = images.map((f) => {
        const val = f
          ?.split('/')
          ?.at(-1)
          ?.match(/[\d]+hr/g)?.[0]
          .slice(0, -2)
        return val ? +val : 0
      })
      fcstTimes.value = ft
      activeFcstTime.value = ft[0]
      return dat
    })
    return dat
  })

  const hasExtreme = computed(() => activeImageFrequency.value.val === '24hrly' && 'extVal' in activeVariable.value)

  const activeImageGroup = computed(() => {
    const name = hasExtreme.value && isExtreme.value ? activeVariable.value.extVal : activeVariable.value.val
    return modelImgs.value?.filter((f) => f.includes(`${name}_`))
  })

  const activeImage = computed(() =>
    activeVariable.value.mult === false
      ? activeImageGroup.value?.[0]
      : activeImageGroup.value?.find((f: string) => f.includes(`${activeFcstTime.value}hr_`))
  )

  return {
    initTime,
    modelImgs,
    fcstTimes,
    metFields,
    imageFrequencies,
    isExtreme,
    hasExtreme,
    activeFcstTime,
    activeVariable,
    activeImageFrequency,
    activeImageGroup,
    activeImage,
  }
})
