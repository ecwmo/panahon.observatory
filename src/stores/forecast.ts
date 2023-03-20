import { nanoquery } from '@nanostores/query'
import { parse } from 'date-fns'
import { action, atom, computed } from 'nanostores'
import { z } from 'zod'

import { imgSrcArr } from '@/schemas/forecast'
import { apiRoute } from '@/stores/routes'

const API_URL = apiRoute('forecast')

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

const getForecastInitTime = (imageStr: string) =>
  parse(`${imageStr.match(/[\d]{4}-[\d]{2}-[\d]{2}_[\d]{2}/g)?.[0]} +08` ?? '', 'yyyy-MM-dd_HH x', new Date())

const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: async (...keys: string[]) => {
    let url = `${location.origin}${API_URL}`
    if (keys[0]?.length > 0) url = `${url}?img=${keys[0]}`
    const res = await fetch(url)
    const dat = imgSrcArr.parse(await res.json()).filter((f) => f.includes('wrf-'))
    if (dat.length === 0) return undefined

    initTime.set(getForecastInitTime(dat[0]))

    const images = dat.filter((f) => f.includes('rain_'))
    const ft = images.map((f) => {
      const val = f
        ?.split('/')
        ?.at(-1)
        ?.match(/[\d]+hr/g)?.[0]
        .slice(0, -2)
      return val ? +val : 0
    })
    fcstTimes.set(ft)
    activeFcstTime.set(ft[0])

    return dat
  },
})

export const initTime = atom(new Date())
export const fcstTimes = atom([0])
export const activeImageFrequency = atom(imageFrequencies[1])
export const isExtreme = atom(false)

const urlImageFreqOpt = computed(activeImageFrequency, (imgFreq) => imgFreq.val)
const modelImgs = createFetcherStore<z.infer<typeof imgSrcArr>>([urlImageFreqOpt])

export const activeVariable = atom(metFields[0])
export const setActiveVariable = action(activeVariable, 'setActiveVariable', (v, newVal) => {
  v.set(newVal)
})

export const activeFcstTime = atom(0)
export const setActiveFcstTime = action(activeFcstTime, 'setActiveFcstTime', (ft, newVal: number) => {
  ft.set(newVal)
})

export const hasExtreme = computed(
  [activeImageFrequency, activeVariable],
  (imgFreq, v) => imgFreq.val === '24hrly' && 'extVal' in v
)

const activeImageGroup = computed([modelImgs, activeVariable, isExtreme, hasExtreme], (imgs, v, isX, hasX) => {
  const name = hasX && isX ? v.extVal : v.val
  return imgs.data?.filter((f) => f.includes(`${name}_`))
})

export const activeImage = computed([activeVariable, activeFcstTime, activeImageGroup], (v, ft, imgGrp) =>
  v.mult === false ? imgGrp?.[0] : imgGrp?.find((g: string) => g.includes(`${ft}hr_`))
)
