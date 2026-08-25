import fs from 'node:fs'

import { GET } from '@/pages/api/climate/projectedmapjson'

vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn(),
  },
}))

vi.mock('@/lib/helper/pages', () => ({
  resourceDir: '/resources',
}))

const readFileSync = vi.mocked(fs.readFileSync)

beforeEach(() => {
  readFileSync.mockReset()
  readFileSync.mockReturnValueOnce(JSON.stringify({
    climate: {
      projected: {
        files: { 'Temperature Anomaly': 'climate/projected/tmean_v2.csv' },
        periods: { '2015 - 2034': { start: 2015, end: 2034 } },
        scenarios: { 'SSP1 - 2.6': 'ssp126' },
      },
    },
  }))
  readFileSync.mockReturnValue(`province,model,anomaly,experiment,year
Abra,Model A,2,ssp126,2015
Abra,Model A,4,ssp126,2016
Batanes,Model A,6,ssp126,2015`)
})

test('reads projected data from APP_RES_DIR without creating a cache file', async () => {
  const response = await GET({
    url: new URL(
      'https://example.test/api/climate/projectedmapjson?projectedData=Temperature%20Anomaly&projectedPeriod=2015%20-%202034&scenario=SSP1%20-%202.6'
    ),
  } as Parameters<typeof GET>[0])

  expect(response.status).toBe(200)
  expect(readFileSync).toHaveBeenCalledWith('/resources/climate/config.json', 'utf-8')
  expect(readFileSync).toHaveBeenCalledWith('/resources/climate/projected/tmean_v2.csv', 'utf-8')
  expect(response.headers.get('X-AltMin')).toBe('3')
  expect(response.headers.get('X-AltMax')).toBe('6')
  expect(response.headers.get('X-Title')).toBe('Temperature Anomaly (SSP1 - 2.6: 2015 - 2034)')
  expect(response.headers.get('X-AltTitle')).toBe('Temperature Anomaly (SSP1 - 2.6: 2015 - 2034)')
  await expect(response.json()).resolves.toEqual([
    { province: 'Abra', averageAnomaly: 3 },
    { province: 'Batanes', averageAnomaly: 6 },
  ])
})
