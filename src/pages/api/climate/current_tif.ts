import type { APIRoute } from 'astro';
import { access, readFile } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';
import { loadClimateConfig, resourcePath } from '@/lib/climate';

const DATA_TYPES = [
    {
        key: 'Rain',
        style: {
            scaling: 'fixed',
            min: '0',
            max: '3000',
            decimals: '0',
            unit: 'mm',
            ramp: [
                { color: '#C7EAE5', label: 'Light Rainfall', value: 0 },
                { color: '#80CDC1', label: '', value: 50 },
                { color: '#35978F', label: '', value: 250 },
                { color: '#01665E', label: '', value: 1500 },
                { color: '#003C30', label: 'Extreme Rainfall', value: 3000 },
            ],
        },
    },
    {
        key: 'Rain Anomaly',
        style: {
            scaling: 'fixed',
            min: '-100',
            max: '400',
            decimals: '0',
            unit: '%',
            ramp: [
                { color: '#A6611A', label: 'Drier Than Baseline', value: -100 },
                { color: '#F5F5F5', label: '', value: 0 },
                { color: '#C7EAE5', label: '', value: 100 },
                { color: '#80CDC1', label: '', value: 200 },
                { color: '#35978F', label: '', value: 300 },
                { color: '#01665E', label: 'Wetter Than Baseline', value: 400 },
            ],
        },
    },
    {
        key: 'Temperature',
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

    const displayConfig = DATA_TYPES.find(d => d.key === pastData);
    if (!displayConfig) {
        return new Response(
            JSON.stringify({ error: 'Invalid pastData parameter' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const climateConfig = loadClimateConfig(resourceDir);
        const dataConfig = climateConfig.climate.current[pastData];
        if (!dataConfig) throw new Error('Missing current climate configuration');
        const parsed = new Date(`${pastPeriod} 1`);
        const year = parsed.getFullYear();
        const monthName = parsed.toLocaleString('default', { month: 'long' });
        const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
        const fileName = `${dataConfig.prefix}${year}-${month}.tif`;
        const filePath = resourcePath(resourceDir, `${dataConfig.directory}/${fileName}`);

        await access(filePath);
        const buffer = await readFile(filePath);

        const styleRaw = Buffer.from(JSON.stringify(displayConfig.style || {}), 'utf-8').toString();
        const style = JSON.parse(styleRaw);

        const title = `${displayConfig.key} (${monthName} ${year})`;

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
                'X-Title': title
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
