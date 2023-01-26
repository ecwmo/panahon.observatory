import { EWBIntImages as dImgSchema, EWBItems as ewbItemsSchema } from '@/schemas/ewb'
import { z } from 'zod'

export type EWBIntImages = z.infer<typeof dImgSchema>
export type EWBItems = z.infer<typeof ewbItemsSchema>
