import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';
import { loadClimateConfig, resourcePath } from '@/lib/climate';

export const GET: APIRoute = async () => {
    try {
        const config = loadClimateConfig(resourceDir);
        const filePath = resourcePath(resourceDir, config.climate.provinces.file);

        // Read file
        const buffer = await readFile(filePath, 'utf-8');

        // Split into lines
        const lines = buffer.trim().split('\n');
        const header = lines[0].split(','); // ADM2_EN,Lat,Lon
        const rows = lines.slice(1);

        // Build array of objects with numeric Lat/Lon
        const provinces = rows.map(line => {
            const cols = line.split(',');
            return {
                name: cols[0].trim(),
                lat: parseFloat(cols[1]),
                lon: parseFloat(cols[2]),
            };
        });

        return new Response(JSON.stringify(provinces), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: `Error reading provinces.csv: ${err}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
