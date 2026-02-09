import type { APIRoute } from 'astro';
import path from 'path';
import { readdir } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';

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
    },
];

function parseDateFromFilename(filename: string, prefix: string): Date | null {
    if (!filename.startsWith(prefix) || !filename.endsWith('.tif')) return null;
    const datePart = filename.slice(prefix.length, filename.length - 4);
    const [year, month] = datePart.split('-');
    if (!year || !month) return null;
    return new Date(Number(year), Number(month) - 1, 1);
}

export const GET: APIRoute = async () => {
    const allDates: Date[] = [];

    for (const c of DATA_TYPES) {
        try {
            const files = await readdir(c.baseDir);
            for (const f of files) {
                const d = parseDateFromFilename(f, c.prefix);
                if (d) allDates.push(d);
            }
        } catch (err) {
            console.error(`Error reading ${c.baseDir}:`, err);
        }
    }

    if (allDates.length === 0) {
        return new Response(
            JSON.stringify({ success: false, message: 'No files found across directories' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const start = new Date(Math.min(...allDates.map(d => d.getTime())));
    const end = new Date(Math.max(...allDates.map(d => d.getTime())));

    const result = {
        success: true,
        start: start.toISOString(),
        end: end.toISOString(),
    };

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};