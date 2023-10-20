import chroma from 'chroma-js'

export type Scale = chroma.Scale

const { scale } = chroma

export const gradientScale = (colors?: string[], levels?: number[]) => scale(colors).domain(levels)

export const interpHexColor = (val: number, gFunc?: Scale) => (gFunc ? gFunc(val).hex() : scale()(val).hex())
