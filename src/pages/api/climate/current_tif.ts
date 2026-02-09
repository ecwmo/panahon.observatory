import type { APIRoute } from 'astro';
import path from 'path';
import { access, readFile } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';

const STYLE_FILENAME = 'style.json';

const DATA_TYPES = [
    {
        key: 'Rain',
        baseDir: path.join(resourceDir, 'climate/current/rain'),
        prefix: 'rain_wrf_anomaly_',
    },
    {
        key: 'Rain Anomaly',
        baseDir: path.join(resourceDir, 'climate/current/anom_rain'),
        prefix: 'anom_rain_wrf_anomaly_',
    },
    {
        key: 'Temperature',
        baseDir: path.join(resourceDir, 'climate/current/temp'),
        prefix: 'temp_wrf_anomaly_',
    },
    {
        key: 'Temperature Anomaly',
        baseDir: path.join(resourceDir, 'climate/current/anom_temp'),
        prefix: 'anom_temp_wrf_anomaly_',
    }
];

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const pastData = url.searchParams.get('pastData');
    const pastPeriod = url.searchParams.get('pastPeriod');

    if (!pastData || !pastPeriod) {
        return new Response(
            JSON.stringify({ error: 'Missing pastData or pastPeriod parameter' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const config = DATA_TYPES.find(d => d.key === pastData);
    if (!config) {
        return new Response(
            JSON.stringify({ error: 'Invalid pastData parameter' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const parsed = new Date(`${pastPeriod} 1`);
        const year = parsed.getFullYear();
        const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
        const fileName = `${config.prefix}${year}-${month}.tif`;
        const filePath = path.join(config.baseDir, fileName);

        await access(filePath);
        const buffer = await readFile(filePath);

        const stylePath = path.join(config.baseDir, STYLE_FILENAME);
        let style: any = null;
        try {
            await access(stylePath);
            const styleRaw = await readFile(stylePath, 'utf-8');
            style = JSON.parse(styleRaw);
        }
        catch {
            style = null;
        }

        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/tiff',
                'Content-Disposition': `inline; filename="${fileName}"`,
                'X-Scaling': style?.scaling,
                'X-Ramp': JSON.stringify(style?.ramp || []),
                'X-Min': style?.min,
                'X-Max': style?.max,
                'X-Decimals': style?.decimals,
                'X-Unit': style?.unit,
            }
        });
    }
    catch (err) {
        return new Response(
            JSON.stringify({ error: `Error reading tif file: ${err}` }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};