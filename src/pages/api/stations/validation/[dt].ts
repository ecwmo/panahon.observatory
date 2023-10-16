import type { APIRoute } from 'astro'

import { parse } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { readFile } from 'fs/promises'

import { resourceDir, resourcePath } from '@/pages/_common'
import { z } from 'zod'

const stationSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
})

export const GET: APIRoute = async ({ params }) => {
  try {
    const stations = await readFile(`${resourceDir}/validation/stations_lufft.json`, 'utf8').then((d) =>
      stationSchema.array().parse(JSON.parse(d))
    )

    const dtStr = `${params.dt}_08 +08`
    const dt = parse(dtStr, 'yyyyMMdd_HH x', new Date())

    const res = stations.map((stn) => {
      const imgFile = `validation_aws_combined_${stn.name.replace(/\ /g, '_')}_${formatInTimeZone(
        dt,
        'Asia/Manila',
        'yyy-MM-dd_HH'
      )}PHT.png`
      return {
        ...stn,
        id: stn.name,
        tsImg: `${resourcePath}/validation/${imgFile}`,
      }
    })

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
