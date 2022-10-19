import { z } from 'zod'

import { imgSrc } from '@/schemas/common'

export const imgSrcArr = imgSrc.array()
