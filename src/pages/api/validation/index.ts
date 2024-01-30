import type { APIRoute } from 'astro'

import { format } from 'date-fns'

import { getLatestDate } from './_helper'

export const GET: APIRoute = async ({ redirect }) => {
  try {
    const dt = await getLatestDate()

    return redirect(`/api/validation/${format(dt, 'yyyyMMdd')}`)
  } catch (error) {
    return new Response(`Something went wrong in api/validation route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    })
  }
}
