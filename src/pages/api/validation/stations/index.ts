import type { APIRoute } from 'astro'

import { readFile } from 'fs/promises'

import { resourceDir, resourcePath } from '@/lib/helper/pages'
import { getImgFile, parseDate, stationSchema } from './_helper'

export const GET: APIRoute = async ({ url: { searchParams } }) => {
  try {
    const stations = await readFile(`${resourceDir}/validation/stations_lufft.json`, 'utf8').then((d) =>
      stationSchema.array().parse(JSON.parse(d))
    )

    const dt = await parseDate(searchParams.get('dt'))

    const res = stations.map((stn) => ({
      ...stn,
      id: stn.name.toLowerCase().replace(/\ /g, '_'),
      tsImg: `${resourcePath}/validation/${getImgFile(stn.name, dt)}`,
    }))

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    return new Response(`Something went wrong in api/validation/stations route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    })
  }
}
