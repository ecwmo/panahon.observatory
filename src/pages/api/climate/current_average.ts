import type { APIRoute } from 'astro';
import path from 'path';
import { fromFile } from 'geotiff';
import { resourceDir } from '@/lib/helper/pages';

const RAIN_BASE_DIR = path.join(resourceDir, 'climate/current/anom_rain/tif');
const TEMP_BASE_DIR = path.join(resourceDir, 'climate/current/anom_temp/tif');

const RAIN_FILE_PREFIX = 'anom_rain_wrf_anomaly_';
const TEMP_FILE_PREFIX = 'anom_temp_wrf_anomaly_';

const RAIN_MEASUREMENT = 'Rainfall (mm)';
const TEMP_MEASUREMENT = 'Temperature (\u00B0C)';

const RAIN_NAME = 'Grid Rainfall Anomaly Trend';
const TEMP_NAME = 'Grid Temperature Anomaly Trend';

const RAIN_DECIMALS = 0;
const TEMP_DECIMALS = 1;

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
        const y = Math.floor((originY - lat) / resY);

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

function formatValue(val: number, pastData: string): number {
    if (pastData === 'Rain Anomaly') {
        return Number(val.toFixed(RAIN_DECIMALS));
    }
    else if (pastData === 'Temperature Anomaly') {
        return Number(val.toFixed(TEMP_DECIMALS));
    }
    return val;
}

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const locationParam = url.searchParams.get('location');
    const lat = parseFloat(url.searchParams.get('lat') || '');
    const lon = parseFloat(url.searchParams.get('lon') || '');
    const pastData = url.searchParams.get('pastData');
    const pastPeriod = url.searchParams.get('pastPeriod');

    if (!locationParam || isNaN(lat) || isNaN(lon) || !pastData || !pastPeriod) {
        return new Response(
            JSON.stringify({ error: 'Missing location, lat, lon, pastData or pastPeriod parameter' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    let measurement: string | null = null;
    let name: string | null = null;
    let baseDir: string | null = null;
    let filePrefix: string | null = null;

    if (pastData === 'Rain Anomaly') {
        baseDir = RAIN_BASE_DIR;
        filePrefix = RAIN_FILE_PREFIX;
        measurement = RAIN_MEASUREMENT;
        name = RAIN_NAME;
    }
    else if (pastData === 'Temperature Anomaly') {
        baseDir = TEMP_BASE_DIR;
        filePrefix = TEMP_FILE_PREFIX;
        measurement = TEMP_MEASUREMENT;
        name = TEMP_NAME;
    }

    let value: number | null = null;
    let trend: (string | number)[][] = [];

    if (baseDir && filePrefix) {
        const parsed = new Date(`${pastPeriod} 1`);
        const year = parsed.getFullYear();
        const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
        const fileName = `${filePrefix}${year}-${month}.tif`;
        const filePath = path.join(baseDir, fileName);

        const rawValue = await getRasterValue(filePath, lat, lon);
        if (rawValue !== null) {
            value = formatValue(rawValue, pastData!);
        }

        for (let i = 0; i < 13; i++) {
            const d = new Date(parsed.getFullYear(), parsed.getMonth() - i, 1);
            const monthAbbr = d.toLocaleString('default', { month: 'short' });
            const y = d.getFullYear();
            const m = (d.getMonth() + 1).toString().padStart(2, '0');
            const trendFileName = `${filePrefix}${y}-${m}.tif`;
            const trendFilePath = path.join(baseDir, trendFileName);

            const v = await getRasterValue(trendFilePath, lat, lon);
            if (v !== null) {
                trend.push([`${monthAbbr} ${y}`, formatValue(v, pastData!)]);
            }
        }
        trend = trend.reverse();
    }

    return new Response(
        JSON.stringify({ location: locationParam, lat, lon, value, measurement, name, trend }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
};