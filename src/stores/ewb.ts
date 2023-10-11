import { action, atom, computed } from 'nanostores'

import type { EWBImages, EWBIntImages, EWBItems } from '@/types/ewb'

export const metadata: Record<string, { items: EWBItems; variants: { val: number; text: string }[] }> = {
  fcst: {
    items: [
      {
        id: 'rain',
        text: 'Daily Rainfall',
      },
      {
        id: 'rainx',
        text: 'Extreme Daily Rainfall',
      },
      {
        id: 'ari',
        text: 'Daily ARI',
      },
      { id: 'wind', text: 'Winds' },
      {
        id: 'hix',
        text: 'Max Heat Index',
      },
    ],
    variants: [
      { val: 24, text: '24hr' },
      { val: 48, text: '48hr' },
      { val: 72, text: '72hr' },
      { val: 96, text: '96hr' },
      { val: 120, text: '120hr' },
    ],
  },
  fcstAccum: {
    items: [
      {
        id: 'rain',
        text: 'WRF Accum Rainfall',
      },
      {
        id: 'rainx',
        text: 'Extreme Accum Rainfall',
      },
    ],
    variants: [
      { val: 1, text: '1day' },
      { val: 3, text: '3day' },
      { val: 5, text: '5day' },
    ],
  },
  obs: {
    items: [
      {
        id: 'gsmap',
        text: 'GSMap',
      },
      {
        id: 'gsmapx',
        text: 'Extreme Rainfall',
      },
      {
        id: 'station',
        text: 'Stations',
      },
    ],
    variants: [
      { val: 1, text: '1day' },
      { val: 3, text: '3day' },
      { val: 5, text: '5day' },
      { val: 7, text: '7day' },
      { val: 30, text: '30day' },
    ],
  },
}

const $ewbImages = atom<EWBImages>()
export const setEWBImages = action($ewbImages, 'setEWBImages', (imgs, newVal) => imgs.set(newVal))

const $activeImgType = atom('fcst')
const setActiveImgType = action($activeImgType, 'setActiveImgType', (imgType, newVal) => imgType.set(newVal))

const $activeGroupIdx = atom(0)
const setActiveGroupIdx = action($activeGroupIdx, 'setActiveGroupIdx', (gIdx, newVal) => gIdx.set(newVal))

const $activeIdx = atom(0)
const setActiveIdx = action($activeIdx, 'setActiveIdx', (idx, newVal) => idx.set(newVal))

const $activeVariables = computed($activeImgType, (imgType) => metadata[imgType]?.items ?? metadata['fcst']?.items)

const $activeImages = computed(
  [$ewbImages, $activeImgType, $activeVariables, $activeGroupIdx],
  (ewbImgs, imgType, vars, idx) => {
    const imgs = ewbImgs?.[imgType as keyof EWBIntImages]
    const activeVar = vars[idx].id
    return (imgs as { [key: string]: string[] })?.[activeVar]
  }
)

export const $activeImage = computed([$activeImages, $activeIdx], (imgs, idx) => imgs?.[idx])
export const setActiveImage = (imgIdx: number, grpIdx: number, imgType: string) => {
  setActiveImgType(imgType)
  setActiveIdx(imgIdx)
  setActiveGroupIdx(grpIdx)
}

export const up = () => {
  setActiveGroupIdx($activeGroupIdx.get() === 0 ? $activeVariables.get().length - 1 : $activeGroupIdx.get() - 1)
}
export const down = () => {
  setActiveGroupIdx($activeGroupIdx.get() === $activeVariables.get().length - 1 ? 0 : $activeGroupIdx.get() + 1)
}
export const prev = () => {
  setActiveIdx($activeIdx.get() === 0 ? $activeImages.get().length - 1 : $activeIdx.get() - 1)
}
export const next = () => {
  setActiveIdx($activeIdx.get() === $activeImages.get().length - 1 ? 0 : $activeIdx.get() + 1)
}
