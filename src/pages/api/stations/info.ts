import type { APIRoute } from 'astro'

import { parse, subDays } from 'date-fns'
import { toDate } from 'date-fns-tz'
import { readFile } from 'fs/promises'

import { resourceDir } from '@/pages/_common'

export const get: APIRoute = async ({ request }) => {
  try {
    const dtStr = await readFile(`${resourceDir}/station/stn_obs_timestamp.json`).then(
      (d) => `${JSON.parse(d)['timestamp'].slice(0, 10)}_08 +08`
    )
    const dt = subDays(parse(dtStr, 'yyyy-MM-dd_HH x', new Date()), 5)

    const stnArr = await Promise.all([
      readFile(`${resourceDir}/station/stn_obs.json`, 'utf8'),
      readFile(`${resourceDir}/station/stn_mo_obs.json`, 'utf8'),
    ]).then((stnArr) =>
      stnArr.reduce(
        (p, c) => [
          ...p,
          ...JSON.parse(c).filter((stn) => {
            const stnDt = toDate(stn['obs']['timestamp'])
            return stnDt >= dt
          }),
        ],
        []
      )
    )

    const res = {
      type: 'FeatureCollection',
      features: stnArr.map((stn) => {
        const dat = { type: 'Feature', geometry: { type: 'Point', coordinates: [stn['lon'], stn['lat']] } }

        const { id, name, lat, lon, elevation, address } = stn
        dat['properties'] = { id, name, lat, lon, elevation, address }

        return dat
      }),
    }

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    return new Response(`Something went wrong in api/stations route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    })
  }
}
