import type { APIRoute } from 'astro';
import path from 'path';
import { access, readFile } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const projectedData = url.searchParams.get('projectedData');
    const projectedPeriod = url.searchParams.get('projectedPeriod');
    const scenario = url.searchParams.get('scenario');

    if (!projectedData || !projectedPeriod || !scenario) {
        return new Response(
            JSON.stringify({ error: 'Missing projectedData, projectedPeriod, or scenario parameter' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    try {
        // For now, just return a blank TIFF buffer as a placeholder.
        // Later you can generate or read actual projected data files.
        const blankBuffer = Buffer.from([]);

        const fileName = `projected_${projectedData}_${scenario}_${projectedPeriod}.tif`;

        return new Response(blankBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/tiff',
                'Content-Disposition': `inline; filename="${fileName}"`,
            },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: `Error generating projected tif file: ${err}` }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};