import type { APIRoute } from 'astro'

import { readFile } from 'fs/promises'

import { resourceDir, resourcePath } from '@/lib/helper/pages'
import { getImgFile, parseDate, stationSchema } from './_helper'

export const GET: APIRoute = async ({ params, url: { searchParams } }) => {
  try {
    const stations = await readFile(`${resourceDir}/validation/stations_lufft.json`, 'utf8').then((d) =>
      stationSchema.array().parse(JSON.parse(d))
    )

    const dt = await parseDate(searchParams.get('dt'))

    const station = stations.find((stn) => stn.name.toLowerCase().replace(/\ /g, '_') === params.name) ?? stations?.[0]

    if (station) {
      const res = {
        ...station,
        id: station.name.toLowerCase().replace(/\ /g, '_'),
        tsImg: `${resourcePath}/validation/${getImgFile(station.name, dt)}`,
      }

      return new Response(JSON.stringify(res), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({}), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    return new Response(`Something went wrong in api/validation/stations route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    })
  }
}
