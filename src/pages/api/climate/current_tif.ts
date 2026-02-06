import type { APIRoute } from 'astro';
import path from 'path';
import { access, readFile } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';

const RAIN_BASE_DIR = path.join(resourceDir, 'climate/current/anom_rain/tif');
const TEMP_BASE_DIR = path.join(resourceDir, 'climate/current/anom_temp/tif');

const RAIN_FILE_PREFIX = 'anom_rain_wrf_anomaly_';
const TEMP_FILE_PREFIX = 'anom_temp_wrf_anomaly_';

const STYLE_FILENAME = 'style.json';

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

    let baseDir: string;
    let filePrefix: string;

    if (pastData === 'Rain Anomaly') {
        baseDir = RAIN_BASE_DIR;
        filePrefix = RAIN_FILE_PREFIX;
    }
    else if (pastData === 'Temperature Anomaly') {
        baseDir = TEMP_BASE_DIR;
        filePrefix = TEMP_FILE_PREFIX;
    }
    else {
        return new Response(
            JSON.stringify({ error: 'Invalid pastData parameter' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const parsed = new Date(`${pastPeriod} 1`);
        const year = parsed.getFullYear();
        const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
        const fileName = `${filePrefix}${year}-${month}.tif`;
        const filePath = path.join(baseDir, fileName);

        await access(filePath);
        const buffer = await readFile(filePath);

        const stylePath = path.join(baseDir, STYLE_FILENAME);
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