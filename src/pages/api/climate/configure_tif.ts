import type { APIRoute } from 'astro';
import path from 'path';
import { fromFile } from 'geotiff';
import { readdir, writeFile, stat, readFile } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';

const STYLE_FILENAME = 'style.json';
const SNAPSHOT_FILENAME = 'snapshot.json';

const DATA_TYPES = [
    {
        key: 'Rain',
        baseDir: path.join(resourceDir, 'climate/current/rain'),
        ramp: [
            { color: '#deebf7', label: 'Light Rainfall', value: null },
            { color: '#6baed6', label: 'Moderate Rainfall', value: null },
            { color: '#08306b', label: 'High Rainfall', value: null },
        ],
        scaling: 'linear',
        anomaly: false,
        decimals: 0,
        unit: 'mm',
    },
    {
        key: 'Rain Anomaly',
        baseDir: path.join(resourceDir, 'climate/current/anom_rain'),
        ramp: [
            { color: '#8c510a', label: 'Drier Than Baseline', value: null },
            { color: '#ffffff', label: 'Normal', value: 0 },
            { color: '#1a9850', label: 'Wetter Than Baseline', value: null },
        ],
        scaling: 'fixed',
        anomaly: true,
        decimals: 0,
        unit: 'mm',
    },
    {
        key: 'Temperature',
        baseDir: path.join(resourceDir, 'climate/current/temp'),
        ramp: [
            { color: '#fee5d9', label: 'Low Temperature', value: null },
            { color: '#fcae91', label: 'Moderate Temperature', value: null },
            { color: '#cb181d', label: 'High Temperature', value: null },
        ],
        scaling: 'linear',
        anomaly: false,
        decimals: 1,
        unit: '\u00B0C',
    },
    {
        key: 'Temperature Anomaly',
        baseDir: path.join(resourceDir, 'climate/current/anom_temp'),
        ramp: [
            { color: '#313695', label: 'Colder Than Baseline', value: null },
            { color: '#ffffff', label: 'Normal', value: 0 },
            { color: '#a50026', label: 'Hotter Than Baseline', value: null },
        ],
        scaling: 'fixed',
        anomaly: true,
        decimals: 1,
        unit: '\u00B0C',
    },
];

async function computeMinMax(dir: string): Promise<{ min: number; max: number }> {
    const files = await readdir(dir);
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for (const file of files) {
        if (!file.endsWith('.tif')) continue;
        try {
            const tiff = await fromFile(path.join(dir, file));
            const image = await tiff.getImage();
            const rasters = await image.readRasters({ window: null });
            const data = rasters[0] as number[];
            for (const v of data) {
                if (typeof v === 'number' && !isNaN(v)) {
                    if (v < min) min = v;
                    if (v > max) max = v;
                }
            }
        }
        catch (err) {
            console.error(`Error reading ${file}:`, err);
        }
    }

    return { min, max };
}

async function getSnapshot(dir: string) {
    const files = await readdir(dir);
    const tifs = files.filter(f => f.endsWith('.tif'));
    const snapshot: Record<string, number> = {};
    for (const f of tifs) {
        const s = await stat(path.join(dir, f));
        snapshot[f] = s.mtimeMs;
    }
    return snapshot;
}

export const POST: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const pastData = url.searchParams.get('pastData');

    const results: Record<string, any> = {};

    const configs = pastData
        ? DATA_TYPES.filter(d => d.key === pastData)
        : DATA_TYPES;

    if (pastData && configs.length === 0) {
        return new Response(
            JSON.stringify({ error: 'Invalid pastData parameter' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    for (const config of configs) {
        try {
            const snapshotPath = path.join(config.baseDir, SNAPSHOT_FILENAME);
            let previousSnapshot: Record<string, number> = {};
            try {
                const raw = await readFile(snapshotPath, 'utf-8');
                previousSnapshot = JSON.parse(raw);
            }
            catch {
                previousSnapshot = {};
            }

            const currentSnapshot = await getSnapshot(config.baseDir);

            if (JSON.stringify(previousSnapshot) === JSON.stringify(currentSnapshot)) {
                results[config.key] = { success: false, message: 'No changes found' };
                continue;
            }

            const { min, max } = await computeMinMax(config.baseDir);

            config.ramp[0].value = min;
            if (config.anomaly) {
                config.ramp[1].value = 0;
            }
            else {
                config.ramp[1].value = (min + max) / 2;
            }
            config.ramp[config.ramp.length - 1].value = max;

            const style = {
                scaling: config.scaling,
                min,
                max,
                decimals: config.decimals,
                unit: config.unit,
                ramp: config.ramp,
            };

            const stylePath = path.join(config.baseDir, STYLE_FILENAME);
            await writeFile(stylePath, JSON.stringify(style, null, 2), 'utf-8');

            await writeFile(snapshotPath, JSON.stringify(currentSnapshot, null, 2), 'utf-8');

            results[config.key] = { success: true, min, max };
        }
        catch (err) {
            results[config.key] = { success: false, error: String(err) };
        }
    }

    return new Response(JSON.stringify(results), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};