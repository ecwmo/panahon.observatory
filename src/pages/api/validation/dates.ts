import type { APIRoute } from 'astro'

import { getDates } from './_helper'

export const GET: APIRoute = async () => {
  try {
    return new Response(JSON.stringify(await getDates()), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    return new Response(`Something went wrong in api/validation route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    })
  }
}
