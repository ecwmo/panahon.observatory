import type { APIRoute } from 'astro'

import { parse } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { readdir } from 'fs/promises'

import { resourceDir } from '@/pages/_common'

export const GET: APIRoute = async ({ params, redirect }) => {
  try {
    const imgFile = await readdir(`${resourceDir}/validation`).then(
      (imgs) => imgs.filter((f) => f.includes('wrf_ensmean-gsmap-24hr_rain_day1') && f.endsWith('.png'))?.[0]
    )

    const dtStr = `${imgFile.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)[0]}_08 +08`
    const dt = parse(dtStr, 'yyyy-MM-dd_HH x', new Date())

    return redirect(`/api/stations/validation/${formatInTimeZone(dt, 'Asia/Manila', 'yyyyMMdd')}`)
  } catch (error) {
    return new Response(`Something went wrong in api/stations route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    })
  }
}
