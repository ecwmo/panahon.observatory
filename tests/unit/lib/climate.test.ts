import path from 'node:path'

import { isValidCoordinate, parseClimateMonth, projectedCsvPath, rasterPixelIndex } from '@/lib/climate'

const config = {
  climate: {
    projected: {
      files: {
        'Temperature Anomaly': 'climate/projected/tmean_v2.csv',
        'Rain Anomaly': 'climate/projected/pr_v2.csv',
      },
      periods: {},
      scenarios: {},
    },
  },
}

describe('projectedCsvPath', () => {
  test.each([
    ['Temperature Anomaly', 'tmean_v2.csv'],
    ['Rain Anomaly', 'pr_v2.csv'],
  ])('resolves %s from the configured resource directory', (projectedData, filename) => {
    expect(projectedCsvPath('/resources', config, projectedData)).toBe(path.join('/resources', 'climate/projected', filename))
  })

  test('rejects unsupported data types', () => {
    expect(() => projectedCsvPath('/resources', config, 'Rain')).toThrow('Unsupported projectedData')
  })
})

describe('rasterPixelIndex', () => {
  test('maps north-up coordinates from the northern edge', () => {
    expect(rasterPixelIndex([120, 10, 130, 20], 100, 100, 19, 121)).toEqual({ x: 10, y: 10 })
  })

  test('rejects coordinates outside the raster bounds', () => {
    expect(rasterPixelIndex([120, 10, 130, 20], 100, 100, 20, 121)).toBeNull()
  })
})

describe('parseClimateMonth', () => {
  test('accepts the selector month format', () => {
    expect(parseClimateMonth('Jan 2026')?.toISOString()).toBe('2026-01-01T00:00:00.000Z')
  })

  test('rejects malformed dates', () => {
    expect(parseClimateMonth('January 2026')).toBeNull()
    expect(parseClimateMonth('2026-01')).toBeNull()
  })
})

test('isValidCoordinate enforces geographic bounds', () => {
  expect(isValidCoordinate(14.6, 121)).toBe(true)
  expect(isValidCoordinate(91, 121)).toBe(false)
  expect(isValidCoordinate(14.6, Infinity)).toBe(false)
})
