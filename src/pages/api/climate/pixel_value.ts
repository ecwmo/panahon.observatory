import type { APIRoute } from 'astro';
import path from 'path';
import { fromFile } from 'geotiff';
import { resourceDir } from '@/lib/helper/pages';

const DATA_TYPES = [
    {
        key: 'Rain',
        baseDir: path.join(resourceDir, 'climate/current/rain'),
        prefix: 'rain_wrf_anomaly_',
        measurement: 'Rainfall (mm)',
        name: 'Grid Rainfall Trend',
        decimals: 0,
        graph: 'line',
        negativeColor: '#08306b',
        positiveColor: '#08306b',
        baselineDir: path.join(resourceDir, 'climate/current/rain_baseline'),
        baselinePattern: '{month}_gsmap_2001-2020_clim.tif',
        baselineNegativeColor: '#666666',
        baselinePositiveColor: '#666666'
    },
    {
        key: 'Rain Anomaly',
        baseDir: path.join(resourceDir, 'climate/current/anom_rain'),
        prefix: 'anom_rain_wrf_anomaly_',
        measurement: 'Rainfall (mm)',
        name: 'Grid Rainfall Anomaly Graph',
        decimals: 0,
        graph: 'bar',
        negativeColor: '#8c510a',
        positiveColor: '#1a9850',
        negativeLegend: 'Drier Than Baseline',
        positiveLegend: 'Wetter Than Baseline'
    },
    {
        key: 'Temperature',
        baseDir: path.join(resourceDir, 'climate/current/temp'),
        prefix: 'temp_wrf_anomaly_',
        measurement: 'Temperature (\u00B0C)',
        name: 'Grid Temperature Trend',
        decimals: 1,
        graph: 'line',
        negativeColor: '#cb181d',
        positiveColor: '#cb181d',
        baselineDir: path.join(resourceDir, 'climate/current/temp_baseline'),
        baselinePattern: '{month}_aphrodite_1971-2000_clim.tif',
        baselineNegativeColor: '#666666',
        baselinePositiveColor: '#666666'
    },
    {
        key: 'Temperature Anomaly',
        baseDir: path.join(resourceDir, 'climate/current/anom_temp'),
        prefix: 'anom_temp_wrf_anomaly_',
        measurement: 'Temperature (\u00B0C)',
        name: 'Grid Temperature Anomaly Graph',
        decimals: 1,
        graph: 'bar',
        negativeColor: '#313695',
        positiveColor: '#a50026',
        negativeLegend: 'Colder Than Baseline',
        positiveLegend: 'Hotter Than Baseline'
    },
];

async function getRasterValue(filePath: string, lat: number, lon: number): Promise<number | null> {
    try {
        const tiff = await fromFile(filePath);
        const image = await tiff.getImage();
        const rasters = await image.readRasters({ window: null });

        const [originX, originY] = image.getOrigin();
        const [resX, resY] = image.getResolution();
        const width = image.getWidth();
        const height = image.getHeight();

        const x = Math.floor((lon - originX) / resX);
        const y = Math.floor((lat - originY) / resY);

        if (x >= 0 && x < width && y >= 0 && y < height) {
            return rasters[0][y * width + x];
        }
        return null;
    }
    catch (err) {
        console.error('Raster read error:', err);
        return null;
    }
}

function formatValue(val: number, decimals: number): number {
    return Number(val.toFixed(decimals));
}

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat') || '');
    const lon = parseFloat(url.searchParams.get('lon') || '');
    const pastData = url.searchParams.get('pastData');
    const pastPeriod = url.searchParams.get('pastPeriod');

    if (isNaN(lat) || isNaN(lon) || !pastData || !pastPeriod) {
        return new Response(
            JSON.stringify({ error: 'Missing location, lat, lon, pastData or pastPeriod parameter' }),
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

    let value: number | null = null;

    const parsed = new Date(`${pastPeriod} 1`);
    const year = parsed.getFullYear();
    const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
    const fileName = `${config.prefix}${year}-${month}.tif`;
    const filePath = path.join(config.baseDir, fileName);

    const rawValue = await getRasterValue(filePath, lat, lon);
    if (rawValue !== null) {
        value = formatValue(rawValue, config.decimals);
    }

    let trend: (string | number)[][] = [];
    for (let i = 0; i < 13; i++) {
        const d = new Date(parsed.getFullYear(), parsed.getMonth() - i, 1);
        const monthAbbr = d.toLocaleString('default', { month: 'short' });
        const y = d.getFullYear();
        const m = (d.getMonth() + 1).toString().padStart(2, '0');
        const trendFileName = `${config.prefix}${y}-${m}.tif`;
        const trendFilePath = path.join(config.baseDir, trendFileName);
        const v = await getRasterValue(trendFilePath, lat, lon);
        if (v !== null) {
            trend.push([`${monthAbbr} ${y}`, formatValue(v, config.decimals)]);
        }
        else {
            trend.push([`${monthAbbr} ${y}`, null]);
        }
    }
    trend = trend.reverse();

    let baseline: (string | number)[][] = [];
    if (config.baselineDir && config.baselinePattern) {
        for (let i = 0; i < 13; i++) {
            const d = new Date(parsed.getFullYear(), parsed.getMonth() - i, 1);
            const monthAbbr = d.toLocaleString('default', { month: 'short' });
            const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');
            const baselineFileName = config.baselinePattern.replace('{month}', monthNum);
            const baselineFilePath = path.join(config.baselineDir, baselineFileName);
            const v = await getRasterValue(baselineFilePath, lat, lon);
            if (v !== null) {
                baseline.push([`${monthAbbr} ${d.getFullYear()}`, formatValue(v, config.decimals)]);
            }
            else {
                baseline.push([`${monthAbbr} ${d.getFullYear()}`, null]);
            }
        }
        baseline = baseline.reverse();
    }

    return new Response(
        JSON.stringify({
            lat,
            lon,
            value,
            measurement: config.measurement,
            name: config.name,
            trend,
            baseline,
            graph: config.graph,
            positiveColor: config.positiveColor,
            negativeColor: config.negativeColor,
            baselinePositiveColor: config.baselinePositiveColor,
            baselineNegativeColor: config.baselineNegativeColor,
            positiveLegend: config.positiveLegend,
            negativeLegend: config.negativeLegend
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
};