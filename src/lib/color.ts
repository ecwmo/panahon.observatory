import type { Scale } from 'chroma-js'
import { scale } from 'chroma-js'

export const gradientScale = (colors?: string[], levels?: number[]) => scale(colors).domain(levels)

export const interpHexColor = (val: number, gFunc?: Scale) => (gFunc ? gFunc(val).hex() : scale()(val).hex())
