import type { APIRoute } from 'astro'

import { formatInTimeZone } from 'date-fns-tz'

import { getLatestDate } from './_helper'

export const GET: APIRoute = async ({ redirect }) => {
  try {
    const dt = await getLatestDate()

    return redirect(`/api/validation/${formatInTimeZone(dt, 'Asia/Manila', 'yyyyMMdd')}`)
  } catch (error) {
    return new Response(`Something went wrong in api/validation route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    })
  }
}
