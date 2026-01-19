import type { APIRoute } from 'astro';
import path from 'path';
import { readFile, access } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const locationParam = url.searchParams.get('location');
    const projectedData = url.searchParams.get('projectedData');     // e.g. Temperature / Rain
    const projectedPeriod = url.searchParams.get('projectedPeriod'); // e.g. "2020 - 2039"
    const scenario = url.searchParams.get('scenario');               // e.g. "RCP4.5"

    if (!locationParam || !projectedData || !projectedPeriod || !scenario) {
        return new Response(
            JSON.stringify({ error: 'Missing projectedData, projectedPeriod, scenario, or location parameter' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    // For now, just return a placeholder value
    const value = 42; // temp value

    return new Response(
        JSON.stringify({
            location: locationParam, // Mapbox.vue uses this
            value, // Mapbox.vue uses this
            projectedData,
            projectedPeriod,
            scenario
        }), // Rest can be modified, whole response is passed as json object to Graph Components
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
};