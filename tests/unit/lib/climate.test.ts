import path from 'node:path'

import { projectedCsvPath } from '@/lib/climate'

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
