import { nanoquery } from '@nanostores/query'
import { format } from 'date-fns'
import { action, atom, computed } from 'nanostores'
import { z } from 'zod'

import { AvailableDates, Images as ImagesSchema } from '@/schemas/validation'
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

const activeImgIdx = atom(0)
const setActiveImgIdx = action(activeImgIdx, 'setActiveImgIdx', (idx, newVal) => idx.set(newVal))

const activeImageGroupIdx = atom(0)
const setActiveImageGroupIdx = action(activeImageGroupIdx, 'setActiveImageGroupIdx', (idx, newVal) => idx.set(newVal))

export const selectedDate = atom(new Date())

const selectedDateStr = computed(selectedDate, (dt) => format(dt, 'yyyyMMdd') ?? '')

const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: async (...keys: string[]) => {
    const res = await fetch(`${location.origin}${API_URL}/${keys[0]}`)
    const dat = ImagesSchema.parse(await res.json())
    const { gsmap: _gsmap } = dat
    return { ...dat, gsmap: [null, null, _gsmap[0], null, null] }
  },
})

export const validationImages = createFetcherStore<z.infer<typeof ImagesSchema>>([selectedDateStr])

const [createDateFetcherStore, createDateMutatorStore] = nanoquery({
  fetcher: async (...keys: string[]) => {
    const res = await fetch(`${location.origin}${API_URL}/dates`)
    const dat = AvailableDates.parse(await res.json())
    selectedDate.set(dat[0])
    return dat
  },
})

export const validationDates = createDateFetcherStore<z.infer<typeof AvailableDates>>([])

const activeImageGroup = computed(activeImageGroupIdx, (imgGrpIdx) => imageGroups[imgGrpIdx])

const activeImages = computed([validationImages, activeImageGroup], (imgs, imgGrp) => imgs.data?.[imgGrp.id])

export const activeImage = computed(
  [activeImgIdx, activeImages, activeImageGroup, validationImages],
  (idx, imgs, imgGrp, vImgs) => (imgGrp.id !== 'gsmap' ? imgs?.[idx] : vImgs.data?.['gsmap'][2]) ?? undefined
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
