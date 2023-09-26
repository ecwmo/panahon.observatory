import type { APIRoute } from 'astro'

import { readFile } from 'fs/promises'

import { resourceDir } from '@/pages/_common'

export const GET: APIRoute = async ({}) => {
  try {
    const res = await readFile(`${resourceDir}/station/weather.json`, 'utf8')

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
