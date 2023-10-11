import { z } from 'zod'

import { EWBImages as EWBImagesSchema, EWBIntImages as dImgSchema, EWBItems as ewbItemsSchema } from '@/schemas/ewb'

export type EWBImages = z.infer<typeof EWBImagesSchema>
export type EWBIntImages = z.infer<typeof dImgSchema>
export type EWBItems = z.infer<typeof ewbItemsSchema>
