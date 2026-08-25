import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import { fromFile } from 'geotiff';
import { resourceDir } from '@/lib/helper/pages';
import { loadClimateConfig, rasterPixelIndex, resourcePath } from '@/lib/climate';

const DATA_TYPES = [
    {
        key: 'Rain',
        measurement: 'Rainfall (mm)',
        name: 'Grid Rainfall Trend',
        decimals: 0,
        graph: 'line',
        negativeColor: '#01665E',
        positiveColor: '#01665E',
        baselineNegativeColor: '#666666',
        baselinePositiveColor: '#666666',
        primaryTooltip: 'Observed monthly average rainfall.',
        secondaryTooltip: 'Historical monthly average rainfall (e.g., January = mean of all Januarys).'
    },
    {
        key: 'Rain Anomaly',
        measurement: 'Rainfall Change (%)',
        name: 'Grid Rainfall Anomaly Graph',
        decimals: 0,
        graph: 'bar',
        negativeColor: '#A6611A',
        positiveColor: '#018571',
        negativeLegend: 'Drier Than Baseline',
        positiveLegend: 'Wetter Than Baseline',
        primaryTooltip: 'Rainfall less than the historical average.',
        secondaryTooltip: 'Rainfall more than the historical average.'
    },
    {
        key: 'Temperature',
        measurement: 'Temperature (\u00B0C)',
        name: 'Grid Temperature Trend',
        decimals: 1,
        graph: 'line',
        negativeColor: '#B2182B',
        positiveColor: '#B2182B',
        baselineNegativeColor: '#666666',
        baselinePositiveColor: '#666666',
        primaryTooltip: 'Observed monthly average temperature.',
        secondaryTooltip: 'Historical monthly average temperature (e.g., January = mean of all Januarys).'
    },
    {
        key: 'Temperature Anomaly',
        measurement: 'Temperature (\u00B0C)',
        name: 'Grid Temperature Anomaly Graph',
        decimals: 1,
        graph: 'bar',
        negativeColor: '#0571B0',
        positiveColor: '#CA0020',
        negativeLegend: 'Colder Than Baseline',
        positiveLegend: 'Hotter Than Baseline',
        primaryTooltip: 'Temperature less than the historical average.',
        secondaryTooltip: 'Temperature more than the historical average.'
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
    let tiff;
    try {
        if (!(await fileExists(filePath))) {
            return null;
        }

        tiff = await fromFile(filePath);
        const image = await tiff.getImage();
        const rasters = await image.readRasters({ window: null });

        const width = image.getWidth();
        const height = image.getHeight();

        const pixel = rasterPixelIndex(image.getBoundingBox(), width, height, lat, lon);

        if (pixel) {
            return rasters[0][pixel.y * width + pixel.x];
        }
        return null;
    }
    catch (err) {
        console.error('Raster read error:', err);
        return null;
    }
    finally {
        if (tiff) {
            try {
                tiff.close();
            } catch (err) {
                console.warn('Error closing GeoTIFF:', err);
            }
        }
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

    const climateConfig = loadClimateConfig(resourceDir);
    const dataConfig = climateConfig.climate.current[pastData];
    if (!dataConfig) {
        return new Response(
            JSON.stringify({ error: 'Missing current climate configuration' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    let value: number | null = null;

    const parsed = new Date(`${pastPeriod} 1`);
    const year = parsed.getFullYear();
    const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
    const fileName = `${dataConfig.prefix}${year}-${month}.tif`;
    const filePath = resourcePath(resourceDir, `${dataConfig.directory}/${fileName}`);

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
        const trendFileName = `${dataConfig.prefix}${y}-${m}.tif`;
        const trendFilePath = resourcePath(resourceDir, `${dataConfig.directory}/${trendFileName}`);

        let v: number | null = null;
        if (await fileExists(trendFilePath)) {
            v = await getRasterValue(trendFilePath, lat, lon);
        }

        trend.push([`${monthAbbr} ${y}`, v !== null ? formatValue(v, config.decimals) : null]);
    }
    trend = trend.reverse();

    let baseline: (string | number)[][] = [];
    if (dataConfig.baselineDirectory && dataConfig.baselinePattern) {
        for (let i = 0; i < 13; i++) {
            const d = new Date(parsed.getFullYear(), parsed.getMonth() - i, 1);
            const monthAbbr = d.toLocaleString('default', { month: 'short' });
            const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');
            const baselineFileName = dataConfig.baselinePattern.replace('{month}', monthNum);
            const baselineFilePath = resourcePath(resourceDir, `${dataConfig.baselineDirectory}/${baselineFileName}`);

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
            negativeLegend: config.negativeLegend,
            primaryTooltip: config.primaryTooltip,
            secondaryTooltip: config.secondaryTooltip
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
};
