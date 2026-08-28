import type { APIRoute } from 'astro'
import axios from 'axios'

export const GET: APIRoute = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  const stationId = searchParams.get('stationId')
  const point = searchParams.get('pt')
  const apiKey = import.meta.env.PANAHON_API_KEY

  if (!apiKey) return new Response(JSON.stringify({ error: 'Station API key is not configured' }), { status: 500 })
  if (!stationId && !point) return new Response(JSON.stringify({ error: 'Missing stationId or pt parameter' }), { status: 400 })

  const baseUrl = import.meta.env.PUBLIC_API_URL.replace(/\/$/, '')
  const path = stationId
    ? `stations/${encodeURIComponent(stationId)}/observations/latest`
    : 'stations/nearest/observations/latest'
  const upstream = new URL(`${baseUrl}/${path}`)
  if (point) upstream.searchParams.set('pt', point)
  upstream.searchParams.set('api_key', apiKey)

  try {
    const response = await axios.get(upstream.toString(), { responseType: 'arraybuffer' })
    return new Response(response.data, {
      status: response.status,
      headers: { 'Content-Type': response.headers['content-type'] ?? 'application/json' },
    })
  } catch (error) {
    console.error(`Station API request failed: ${upstream}`, error)
    return new Response(JSON.stringify({ error: 'Station API is unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
