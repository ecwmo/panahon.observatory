import type { APIRoute } from 'astro'

import { readFile } from 'fs/promises'

import { resourceDir } from '@/pages/_common'

export const GET: APIRoute = async ({ params, request }) => {
  try {
    if (params.type === 'csv') {
      const csv = await readFile(`${resourceDir}/station/stn_obs_24hr.csv`, 'utf8')

      return new Response(csv, {
        status: 200,
        headers: {
          'content-type': 'text/csv',
          'content-disposition': 'attachment; filename="stn_obs_24hr.csv"',
          pragma: 'no-cache',
          expires: '0',
        },
      })
    }

    const res = await readFile(`${resourceDir}/station/stn_obs_24hr.json`, 'utf8')

    return new Response(res, {
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
