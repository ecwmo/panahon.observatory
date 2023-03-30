import { format, parse } from 'date-fns'
import { action, atom, computed } from 'nanostores'

import { createFetcherStore, isReady } from './fetcher'

import { Images as ImagesSchema } from '@/schemas/validation'
import { apiRoute } from '@/stores/routes'
import type { Images } from '@/types/validation'

const API_URL = apiRoute('validation')

export const imageGroups: { id: keyof Images; text: string }[] = [
  { id: 'wrf', text: 'WRF ensmean' },
  { id: 'wrf_run1', text: 'WRF run 1' },
  { id: 'wrf_run2', text: 'WRF run 2' },
  { id: 'wrf_run3', text: 'WRF run 3' },
  { id: 'gfs', text: 'GFS' },
  { id: 'gsmap', text: 'GSMAP' },
  { id: 'wrf_ensmean_gsmap', text: 'WRF mean – GSMAP' },
  { id: 'wrf_run1_gsmap', text: 'WRF run 1 – GSMAP' },
  { id: 'wrf_run2_gsmap', text: 'WRF run 2 – GSMAP' },
  { id: 'wrf_run3_gsmap', text: 'WRF run 3 – GSMAP' },
  { id: 'gfs_gsmap', text: 'GFS – GSMAP' },
]

export const leadTimes = [
  { val: 5, text: '5' },
  { val: 4, text: '4' },
  { val: 3, text: '3' },
  { val: 2, text: '2' },
  { val: 1, text: '1' },
]

export const selectedDate = atom(new Date())
const selectedDateStr = computed(selectedDate, (dt) => format(dt, 'yyyyMMdd') ?? undefined)

export const validationDates = atom<Date[]>()
const validationDateStrs = createFetcherStore<string[]>([`${API_URL}/dates`])
validationDateStrs.subscribe((res) => {
  if (isReady(res)) {
    const dates = res.data?.map((dt) => parse(dt, 'yyyy-MM-dd', new Date())) ?? []
    validationDates.set(dates)
    selectedDate.set(dates?.[0])
  }
})

const _validationImages = createFetcherStore([API_URL, '/', selectedDateStr])
export const validationImages = computed([_validationImages], (res) =>
  isReady(res) ? ImagesSchema.parse(res.data) : undefined
)
const activeImgIdx = atom(0)
const setActiveImgIdx = action(activeImgIdx, 'setActiveImgIdx', (idx, newVal) => idx.set(newVal))
const activeImageGroupIdx = atom(0)
const setActiveImageGroupIdx = action(activeImageGroupIdx, 'setActiveImageGroupIdx', (idx, newVal) => idx.set(newVal))
const activeImageGroup = computed(activeImageGroupIdx, (imgGrpIdx) => imageGroups[imgGrpIdx])
const activeImages = computed([validationImages, activeImageGroup], (imgs, imgGrp) => imgs?.[imgGrp.id])
export const activeImage = computed(
  [activeImgIdx, activeImages, activeImageGroup, validationImages],
  (idx, imgs, imgGrp, vImgs) => (imgGrp.id !== 'gsmap' ? imgs?.[idx] : vImgs?.['gsmap'][0]) ?? undefined
)
export const setActiveImage = (imgIdx: number, grpIdx: number) => {
  setActiveImgIdx(imgIdx)
  setActiveImageGroupIdx(grpIdx)
}

export const up = () => {
  setActiveImageGroupIdx(activeImageGroupIdx.get() === 0 ? imageGroups.length - 1 : activeImageGroupIdx.get() - 1)
}
export const down = () => {
  setActiveImageGroupIdx(activeImageGroupIdx.get() === imageGroups.length - 1 ? 0 : activeImageGroupIdx.get() + 1)
}
export const prev = () => {
  if (activeImageGroup.get().id !== 'gsmap' && activeImages.get()) {
    setActiveImgIdx(activeImgIdx.get() === 0 ? activeImages.get().length - 1 : activeImgIdx.get() - 1)
  }
}
export const next = () => {
  if (activeImageGroup.get().id !== 'gsmap' && activeImages.get()) {
    setActiveImgIdx(activeImgIdx.get() === activeImages.get().length - 1 ? 0 : activeImgIdx.get() + 1)
  }
}
