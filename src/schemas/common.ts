import camelcaseKeys from 'camelcase-keys'
import { z } from 'zod'

export const camelize = <T extends readonly unknown[] | Record<string, unknown>>(val: T) => camelcaseKeys(val)

export const imgSrc = z.string().regex(/\.(jpe?g|png)$/i)
