import SunCalc from 'suncalc'
import { clearSkyIrradiance } from '@/lib/irradiance'

describe('clearSkyIrradiance', () => {
  const lat = 14.5995
  const lon = 120.9842

  test('midday', ({ expect }) => {
    const irradiance = clearSkyIrradiance(lat, lon, new Date('2025-06-21T04:00:00Z'))
    expect(irradiance).toBeGreaterThan(500)
    expect(irradiance).toBeLessThan(1400)
  })

  test('morning', ({ expect }) => {
    const irradiance = clearSkyIrradiance(lat, lon, new Date('2025-06-21T23:00:00Z'))
    expect(irradiance).toBeGreaterThan(0)
    expect(irradiance).toBeLessThan(500)
  })

  test('night', ({ expect }) => {
    const irradiance = clearSkyIrradiance(lat, lon, new Date('2025-06-21T12:00:00Z'))
    expect(irradiance).toBe(0)
  })

  test('optional date', ({ expect }) => {
    // Force altitude high to avoid zero
    vi.spyOn(SunCalc, 'getPosition').mockReturnValue({ altitude: (45 * Math.PI) / 180, azimuth: 0 })

    const result = clearSkyIrradiance(lat, lon)
    expect(typeof result).toBe('number')
    expect(result).toBeGreaterThan(0)
  })
})
