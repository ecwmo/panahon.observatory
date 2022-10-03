import { z } from 'zod'

import { Images as ImagesSchema } from '@/schemas/validation'

export type Images = z.infer<typeof ImagesSchema>
