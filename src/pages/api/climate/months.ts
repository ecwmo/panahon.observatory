import type { APIRoute } from 'astro';
import { readdir } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';
import { loadClimateConfig, resourcePath } from '@/lib/climate';

function parseDateFromFilename(filename: string, prefix: string): Date | null {
    if (!filename.startsWith(prefix) || !filename.endsWith('.tif')) return null;
    const datePart = filename.slice(prefix.length, filename.length - 4);
    const [year, month] = datePart.split('-');
    if (!year || !month) return null;
    return new Date(Number(year), Number(month) - 1, 1);
}

export const GET: APIRoute = async () => {
    const allDates: Date[] = [];
    const climate = loadClimateConfig(resourceDir).climate;

    for (const [key, data] of Object.entries(climate.current)) {
        const baseDir = resourcePath(resourceDir, data.directory);
        try {
            const files = await readdir(baseDir);
            for (const f of files) {
                const d = parseDateFromFilename(f, data.prefix);
                if (d) allDates.push(d);
            }
        } catch (err) {
            console.error(`Error reading ${key} data at ${baseDir}:`, err);
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
