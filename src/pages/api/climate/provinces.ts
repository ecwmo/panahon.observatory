import type { APIRoute } from 'astro';
import path from 'path';
import { readFile } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';

export const GET: APIRoute = async () => {
    try {
        // Path to CSV
        const filePath = path.join(resourceDir, 'climate/provinces/provinces.csv');

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
                ADM2_EN: cols[0].trim(),
                Lat: parseFloat(cols[1]),
                Lon: parseFloat(cols[2]),
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