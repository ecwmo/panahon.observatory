import path from 'node:path'

import { projectedCsvPath, rasterPixelIndex } from '@/lib/climate'

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
