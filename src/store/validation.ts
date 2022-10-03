import { defineStore } from 'pinia'

import { Images as ImagesSchema, AvailableDates } from '@/schemas/validation'
import type { Images } from '@/types/validation'

export const useValidationStore = defineStore('validation', () => {
  const imageGroups: { id: keyof Images; text: string }[] = [
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

  const leadTimes = [
    { val: 5, text: '5' },
    { val: 4, text: '4' },
    { val: 3, text: '3' },
    { val: 2, text: '2' },
    { val: 1, text: '1' },
  ]

  const activeImgIdx = ref(0)
  const activeImageGroupIdx = ref(0)
  const selectedDate = ref('')

  const { data } = useQuery(['validationImgs', selectedDate], async () => {
    const dat = await axios(`api/validation.php?dt=${selectedDate.value ?? ''}`).then(({ data }) =>
      ImagesSchema.parse(data)
    )
    const { gsmap: _gsmap } = dat
    return { ...dat, gsmap: [null, null, _gsmap[0], null, null] }
  })

  const { data: validationDates } = useQuery(['validationDates'], async () => {
    const dat = await axios('api/validation.php?dates').then(({ data }) => AvailableDates.parse(data))
    selectedDate.value = dat[0]
    return dat
  })

  const activeImageGroup = computed(() => imageGroups[activeImageGroupIdx.value])

  const activeImages = computed(() => data?.value?.[activeImageGroup.value.id])

  const activeImage = computed(
    () =>
      (activeImageGroup.value.id !== 'gsmap' ? activeImages?.value?.[activeImgIdx.value] : data?.value?.['gsmap'][2]) ??
      undefined
  )

  const setActiveImage = (imgIdx: number, grpIdx: number) => {
    activeImgIdx.value = imgIdx
    activeImageGroupIdx.value = grpIdx
  }

  const up = () => {
    activeImageGroupIdx.value = activeImageGroupIdx.value === 0 ? imageGroups.length - 1 : activeImageGroupIdx.value - 1
  }

  const down = () => {
    activeImageGroupIdx.value = activeImageGroupIdx.value === imageGroups.length - 1 ? 0 : activeImageGroupIdx.value + 1
  }

  const prev = () => {
    if (activeImageGroup.value.id !== 'gsmap' && activeImages?.value) {
      activeImgIdx.value = activeImgIdx.value === 0 ? activeImages.value.length - 1 : activeImgIdx.value - 1
    }
  }

  const next = () => {
    if (activeImageGroup.value.id !== 'gsmap' && activeImages?.value) {
      activeImgIdx.value = activeImgIdx.value === activeImages.value.length - 1 ? 0 : activeImgIdx.value + 1
    }
  }

  return {
    data,
    validationDates,
    selectedDate,
    imageGroups,
    leadTimes,
    activeImage,
    setActiveImage,
    up,
    down,
    prev,
    next,
  }
})
