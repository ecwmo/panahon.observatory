import type { APIRoute } from 'astro';
import path from 'path';
import fs from 'fs/promises';
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
        negativeColor: '#01665E',
        positiveColor: '#01665E',
        baselineDir: path.join(resourceDir, 'climate/current/rain_baseline'),
        baselinePattern: '{month}_gsmap_2001-2020_clim.tif',
        baselineNegativeColor: '#666666',
        baselinePositiveColor: '#666666'
    },
    {
        key: 'Rain Anomaly',
        baseDir: path.join(resourceDir, 'climate/current/anom_rain'),
        prefix: 'anom_rain_wrf_anomaly_',
        measurement: 'Rainfall Change (%)',
        name: 'Grid Rainfall Anomaly Graph',
        decimals: 0,
        graph: 'bar',
        negativeColor: '#A6611A',
        positiveColor: '#018571',
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
        negativeColor: '#B2182B',
        positiveColor: '#B2182B',
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
        negativeColor: '#0571B0',
        positiveColor: '#CA0020',
        negativeLegend: 'Colder Than Baseline',
        positiveLegend: 'Hotter Than Baseline'
    }
];

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}

async function getRasterValue(filePath: string, lat: number, lon: number): Promise<number | null> {
    try {
        if (!(await fileExists(filePath))) {
            return null;
        }

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

        let v: number | null = null;
        if (await fileExists(trendFilePath)) {
            v = await getRasterValue(trendFilePath, lat, lon);
        }

        trend.push([`${monthAbbr} ${y}`, v !== null ? formatValue(v, config.decimals) : null]);
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

            let v: number | null = null;
            if (await fileExists(baselineFilePath)) {
                v = await getRasterValue(baselineFilePath, lat, lon);
            }

            baseline.push([`${monthAbbr} ${d.getFullYear()}`, v !== null ? formatValue(v, config.decimals) : null]);
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