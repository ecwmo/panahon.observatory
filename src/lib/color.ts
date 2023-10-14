export const gradientScale = (colors?: string[], levels?: number[]) => chroma.scale(colors).domain(levels)

export const interpHexColor = (val: number, gFunc?: chroma.Scale) =>
  gFunc ? gFunc(val).hex() : chroma.scale()(val).hex()
