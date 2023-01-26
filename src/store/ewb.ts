import { defineStore } from 'pinia'

import { EWBImages } from '@/schemas/ewb'
import type { EWBIntImages, EWBItems } from '@/types/ewb'

export const useEWBStore = defineStore('ewb', () => {
  const activeImgType = ref('fcst')
  const activeGroupIdx = ref(0)
  const activeIdx = ref(0)

  const { data } = useQuery(
    ['ewbImgs'],
    async () => await axios('api/ewb.php').then(({ data }) => EWBImages.parse(data))
  )

  const metadata: Record<string, { items: EWBItems; variants: { val: number; text: string }[] }> = {
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

  const activeVariables = computed(() => metadata[activeImgType.value]?.items ?? metadata['fcst']?.items)

  const activeImages = computed(() => {
    const imgs = data.value?.[activeImgType.value as keyof EWBIntImages]
    const activeVar = activeVariables.value[activeGroupIdx.value].id
    return (imgs as { [key: string]: string[] })?.[activeVar]
  })

  const activeImage = computed(() => activeImages.value[activeIdx.value])

  const setActiveImage = (imgIdx: number, grpIdx: number, imgType: string) => {
    activeImgType.value = imgType
    activeIdx.value = imgIdx
    activeGroupIdx.value = grpIdx
  }

  const up = () => {
    activeGroupIdx.value = activeGroupIdx.value === 0 ? activeVariables.value.length - 1 : activeGroupIdx.value - 1
  }

  const down = () => {
    activeGroupIdx.value = activeGroupIdx.value === activeVariables.value.length - 1 ? 0 : activeGroupIdx.value + 1
  }

  const prev = () => {
    activeIdx.value = activeIdx.value === 0 ? activeImages.value.length - 1 : activeIdx.value - 1
  }

  const next = () => {
    activeIdx.value = activeIdx.value === activeImages.value.length - 1 ? 0 : activeIdx.value + 1
  }

  return {
    data,
    metadata,
    activeImage,
    setActiveImage,
    up,
    down,
    prev,
    next,
  }
})
