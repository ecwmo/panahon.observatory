import type { APIRoute } from 'astro';
import path from 'path';
import { access, readFile } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const pastData = url.searchParams.get('pastData');
    const pastPeriod = url.searchParams.get('pastPeriod');

    if (!pastData || !pastPeriod) {
        return new Response(JSON.stringify({ error: 'Missing pastData or pastPeriod parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let baseDir: string;
    let filePrefix: string;

    if (pastData === 'Rain Anomaly') {
        baseDir = path.join(resourceDir, 'climate/rain/tif');
        filePrefix = 'rain_wrf_anomaly_';
    }
    else if (pastData === 'Temperature Anomaly') {
        baseDir = path.join(resourceDir, 'climate/temp/tif');
        filePrefix = 'temp_wrf_anomaly_';
    }
    else {
        return new Response(JSON.stringify({ error: 'Invalid pastData parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const parsed = new Date(`${pastPeriod} 1`);
        const year = parsed.getFullYear();
        const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
        const fileName = `${filePrefix}${year}-${month}.tif`;
        const filePath = path.join(baseDir, fileName);

        await access(filePath);
        const buffer = await readFile(filePath);

        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/tiff',
                'Content-Disposition': `inline; filename="${fileName}"`,
                //'X-Debug-File': filePath,
            },
        });
    }
    catch (err) {
        return new Response(JSON.stringify({ error: `Error reading tif file: ${err}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};