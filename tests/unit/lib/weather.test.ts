import { heatIndex, cloudCover } from '@/lib/weather'
import * as mod from '@/lib/irradiance'

describe('heatIndex', () => {
  test('null', () => {
    expect(heatIndex(0, 0)).toBe(null)
    expect(heatIndex(24, 70)).toBe(null) // tf < 76
    expect(heatIndex(53, 70)).toBe(null) // tf > 126
    expect(heatIndex(28, -10)).toBe(null) // rh < 0
    expect(heatIndex(28, 110)).toBe(null) // rh > 100
    expect(heatIndex(37.5, 98.0)).toBe(null) // hiF > 183.5
  })

  test('valid', () => {
    expect(heatIndex(25.0, 60.0)).toBe(25.1) // easy
    expect(heatIndex(38.5, 12)).toBe(35.7) // adjust 1
    expect(heatIndex(29.5, 86.5)).toBe(37.9) // adjust 2
    expect(heatIndex(44.7, 15.0)).toBe(44.0) // adjust 3
  })
})

describe('cloudCover stability tests with clamping', () => {
  beforeEach(() => {
    // Mock clearSkyIrradiance to a fixed value for consistent tests
    vi.spyOn(mod, 'clearSkyIrradiance').mockReturnValue(1000)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('default', () => {
    expect(cloudCover(270, 14.6, 120.98)).toBe('Overcast')
    expect(cloudCover(700, 14.6, 120.98)).toBe('Mostly Cloudy')
    expect(cloudCover(900, 14.6, 120.98)).toBe('Partly Cloudy')
    expect(cloudCover(990, 14.6, 120.98)).toBe('Clear')
  })

  it('sRad > clear sky', () => {
    expect(cloudCover(1100, 14.6, 120.98)).toBe('Clear')
  })

  it('zero sRad', () => {
    expect(cloudCover(0, 14.6, 120.98)).toBe('Overcast')
  })

  it('negative sRad', () => {
    // negative sensor reading is clamped to 0 for transmittance → max cloud fraction
    expect(cloudCover(-20, 14.6, 120.98)).toBe('Overcast')
  })

  it('very small positive sRad', () => {
    expect(cloudCover(50, 14.6, 120.98)).toBe('Overcast')
  })
})
