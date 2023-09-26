import type { APIRoute } from 'astro'

import { parse } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { readFile } from 'fs/promises'

import { resourceDir, resourcePath } from '@/pages/_common'

export const GET: APIRoute = async ({ params }) => {
  try {
    const stnArr = await readFile(`${resourceDir}/validation/stations_lufft.json`).then((d) => JSON.parse(d))

    const dtStr = `${params.dt}_08 +08`
    const dt = parse(dtStr, 'yyyyMMdd_HH x', new Date())

    const res = {
      type: 'FeatureCollection',
      features: stnArr.map((stn) => {
        const dat = { type: 'Feature', geometry: { type: 'Point', coordinates: [stn['lon'], stn['lat']] } }

        const imgFile = `validation_aws_combined_${stn['name'].replace(/\ /g, '_')}_${formatInTimeZone(
          dt,
          'Asia/Manila',
          'yyy-MM-dd_HH'
        )}PHT.png`
        dat['properties'] = {
          ...stn,
          id: stn['name'],
          tsImg: `${resourcePath}/validation/${imgFile}`,
        }

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
