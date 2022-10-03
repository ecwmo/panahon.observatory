import { z } from 'zod'

import { imgSrc } from '@/schemas/common'

const nImgSrc = imgSrc.nullable()

const imgSrcArr = nImgSrc.nullable().array().length(5)

export const Images = z.object({
  wrf: imgSrcArr,
  wrf_run1: imgSrcArr,
  wrf_run2: imgSrcArr,
  wrf_run3: imgSrcArr,
  gsmap: nImgSrc.nullable().array().length(1),
  gfs: imgSrcArr,
  wrf_ensmean_gsmap: imgSrcArr,
  wrf_run1_gsmap: imgSrcArr,
  wrf_run2_gsmap: imgSrcArr,
  wrf_run3_gsmap: imgSrcArr,
  gfs_gsmap: imgSrcArr,
})

export const AvailableDates = z.string().array()
