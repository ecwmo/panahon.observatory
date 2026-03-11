import type { APIRoute } from 'astro';
import path from 'path';
import { access, readFile } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';

const DATA_TYPES = [
    {
        key: 'Rain',
        baseDir: path.join(resourceDir, 'climate/current/rain'),
        prefix: 'rain_wrf_anomaly_',
        style: {
            scaling: 'linear',
            min: '0',
            max: '3000',
            decimals: '0',
            unit: 'mm',
            ramp: [
                { color: '#C7EAE5', label: 'Light Rainfall', value: 0 },
                { color: '#5AB4AC', label: 'Moderate Rainfall', value: 1500 },
                { color: '#01665E', label: 'High Rainfall', value: 3000 },
            ],
        },
    },
    {
        key: 'Rain Anomaly',
        baseDir: path.join(resourceDir, 'climate/current/anom_rain'),
        prefix: 'anom_rain_wrf_anomaly_',
        style: {
            scaling: 'fixed',
            min: '-400',
            max: '400',
            decimals: '0',
            unit: 'mm',
            ramp: [
                { color: '#A6611A', label: 'Drier Than Baseline', value: -400 },
                { color: '#F5F5F5', label: 'Normal', value: 0 },
                { color: '#018571', label: 'Wetter Than Baseline', value: 400 },
            ],
        },
    },
    {
        key: 'Temperature',
        baseDir: path.join(resourceDir, 'climate/current/temp'),
        prefix: 'temp_wrf_anomaly_',
        style: {
            scaling: 'linear',
            min: '25',
            max: '32',
            decimals: '1',
            unit: '\u00B0C',
            ramp: [
                { color: '#FDDBC7', label: 'Low Temperature', value: 25 },
                { color: '#EF8A62', label: 'Moderate Temperature', value: 28.5 },
                { color: '#B2182B', label: 'High Temperature', value: 32 },
            ],
        },
    },
    {
        key: 'Temperature Anomaly',
        baseDir: path.join(resourceDir, 'climate/current/anom_temp'),
        prefix: 'anom_temp_wrf_anomaly_',
        style: {
            scaling: 'fixed',
            min: '-5',
            max: '5',
            decimals: '1',
            unit: '\u00B0C',
            ramp: [
                { color: '#0571B0', label: 'Colder Than Baseline', value: -5 },
                { color: '#F7F7F7', label: 'Normal', value: 0 },
                { color: '#CA0020', label: 'Hotter Than Baseline', value: 5 },
            ],
        },
    },
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

        const styleRaw = Buffer.from(JSON.stringify(config.style || {}), 'utf-8').toString();
        const style = JSON.parse(styleRaw);

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