const rainGradient = [
  { val: 0, rgb: [245, 245, 245] },
  { val: 0.2, rgb: [199, 234, 229] },
  { val: 0.4, rgb: [128, 205, 193] },
  { val: 0.6, rgb: [53, 151, 143] },
  { val: 0.8, rgb: [1, 102, 94] },
  { val: 1, rgb: [0, 60, 48] },
]

const tempGradient = [
  { val: 0, rgb: [247, 247, 247] },
  { val: 0.2, rgb: [253, 219, 199] },
  { val: 0.4, rgb: [244, 165, 130] },
  { val: 0.6, rgb: [214, 96, 77] },
  { val: 0.8, rgb: [178, 24, 43] },
  { val: 1, rgb: [103, 0, 31] },
]

const getGradient = (varName: string) => {
  if (varName === 'temp') return tempGradient
  else if (varName === 'rain') return rainGradient
  return []
}

const componentToHex = (c: number) => {
  let hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

const rgbToHex = (rgb: number[]) => '#' + rgb.map(componentToHex).join('')

const getColor = (val: number, varName: string) => {
  const gradient = getGradient(varName)
  let rgb = gradient.length > 0 ? gradient[gradient.length - 1].rgb : [0, 0, 0]

  if (val === null) return ''

  gradient.every((g) => {
    if (val <= g.val) {
      rgb = g.rgb
      return false
    }

    return true
  })

  return rgbToHex(rgb)
}

interface ColorSwatch {
  color: string
  label: number
}

const getSwatch = (varName: string, minVal: number, maxVal: number): ColorSwatch[] => {
  const gradient = getGradient(varName)

  return gradient.map((g) => {
    const label = minVal + +((maxVal - minVal) * g.val).toFixed()
    return {
      color: rgbToHex(g.rgb),
      label,
    }
  })
}

export { getColor, getSwatch, ColorSwatch }
