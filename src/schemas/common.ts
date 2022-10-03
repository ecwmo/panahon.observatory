import { z } from 'zod'

export const imgSrc = z.string().regex(/\.(jpe?g|png)$/i)
