import { parse } from 'date-fns'
import { action, atom, computed } from 'nanostores'
import { z } from 'zod'

import { imgSrcArr } from '@/schemas/forecast'

export const imageFrequencies = [
  { val: '24hrly', text: '24hr' },
  { val: '3hrly', text: '3hr' },
]

export const metFields = [
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

export const getForecastInitTime = (imageStr: string) =>
  parse(`${imageStr.match(/[\d]{4}-[\d]{2}-[\d]{2}_[\d]{2}/g)?.[0]} +08` ?? '', 'yyyy-MM-dd_HH x', new Date())

export const $initTime = atom(new Date())
export const setInitTime = action($initTime, 'setInitTime', (t, newTime: Date) => {
  t.set(newTime)
})

export const $fcstTimes = atom([0])
export const $activeImageFrequency = atom(imageFrequencies[1])
export const $isExtreme = atom(false)

const modelImgs = atom<z.infer<typeof imgSrcArr>>()
export const setModelImgs = action(modelImgs, 'setModelImgs', (imgs, newImgs: string[]) => {
  imgs.set(newImgs)
  $initTime.set(getForecastInitTime(newImgs[0]))

  const images = newImgs.filter((f) => f.includes('rain_'))
  const ft = images.map((f) => {
    const val = f
      ?.split('/')
      ?.at(-1)
      ?.match(/[\d]+hr/g)?.[0]
      .slice(0, -2)
    return val ? +val : 0
  })
  $fcstTimes.set(ft)
  $activeFcstTime.set(ft[0])
})

export const $activeVariable = atom(metFields[0])
export const setActiveVariable = action($activeVariable, 'setActiveVariable', (v, newVal) => {
  v.set(newVal)
})

export const $activeFcstTime = atom(0)
export const setActiveFcstTime = action($activeFcstTime, 'setActiveFcstTime', (ft, newVal: number) => {
  ft.set(newVal)
})

export const $hasExtreme = computed(
  [$activeImageFrequency, $activeVariable],
  (imgFreq, v) => imgFreq.val === '24hrly' && 'extVal' in v
)

const $activeImageGroup = computed([modelImgs, $activeVariable, $isExtreme, $hasExtreme], (imgs, v, isX, hasX) => {
  const name = hasX && isX ? v.extVal : v.val
  return imgs?.filter((f) => f.includes(`${name}_`))
})

export const $activeImage = computed([$activeVariable, $activeFcstTime, $activeImageGroup], (v, ft, imgGrp) =>
  v.mult === false ? imgGrp?.[0] : imgGrp?.find((g: string) => g.includes(`${ft}hr_`))
)
