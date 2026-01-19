import type { APIRoute } from 'astro';
import path from 'path';
import { readFile, access } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';

function parseCSV(content: string): Record<string, string>[] {
    const lines = content.split(/\r?\n/).filter(Boolean);
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = values[i]?.trim() ?? '';
        });
        return obj;
    });
}

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const locationParam = url.searchParams.get('location');
    const pastData = url.searchParams.get('pastData');
    const pastPeriod = url.searchParams.get('pastPeriod');

    if (!locationParam || !pastData || !pastPeriod) {
        return new Response(JSON.stringify({ error: 'Missing location or pastData or pastPeriod parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let value: number | null = null;
    let measurement: string | null = null;
    let name: string | null = null;
    let trend: (string | number)[][] = [];
    let debug: string[] = [];

    let baseDir: string;
    let filePrefix: string;

    if (pastData === 'Rain Anomaly') {
        baseDir = path.join(resourceDir, 'climate/rain/csv');
        filePrefix = 'rain_wrf_anomaly_';
        measurement = 'Rainfall (mm)';
        name = 'Rainfall Trend';
    }
    else if (pastData === 'Temperature Anomaly') {
        baseDir = path.join(resourceDir, 'climate/temp/csv');
        filePrefix = 'temp_wrf_anomaly_';
        measurement = 'Temperature (\u00B0C)';
        name = 'Temperature Trend';
    }

    if (pastData && pastPeriod && baseDir) {
        try {
            const parsed = new Date(`${pastPeriod} 1`);

            const year = parsed.getFullYear();
            const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
            const fileName = `${filePrefix}${year}-${month}.csv`;
            const filePath = path.join(baseDir, fileName);

            try {
                await access(filePath);
                debug.push(`Reading CSV file: ${filePath}`);

                const fileContent = await readFile(filePath, 'utf8');
                const csvData = parseCSV(fileContent);

                const row = csvData.find(
                    r => String(r.ADM2_EN).trim().toLowerCase() === locationParam.trim().toLowerCase()
                );

                if (row) {
                    value = Number(row.Average);
                    debug.push(`Found value: ${value}`);
                } else {
                    debug.push(`No match found for location: ${locationParam}`);
                }

            } catch {
                debug.push(`CSV file not found: ${filePath}`);
            }

            for (let i = 0; i < 13; i++) {
                const d = new Date(parsed.getFullYear(), parsed.getMonth() - i, 1);
                const monthAbbr = d.toLocaleString('default', { month: 'short' });
                const year = d.getFullYear();
                const month = (d.getMonth() + 1).toString().padStart(2, '0');
                const trendFileName = `${filePrefix}${year}-${month}.csv`;
                const trendFilePath = path.join(baseDir, trendFileName);

                try {
                    await access(trendFilePath);
                    const fileContent = await readFile(trendFilePath, 'utf8');
                    const csvData = parseCSV(fileContent);
                    const row = csvData.find(
                        r => String(r.ADM2_EN).trim().toLowerCase() === locationParam.trim().toLowerCase()
                    );

                    if (row) {
                        const label = `${monthAbbr} ${year}`;
                        trend.push([label, Number(row.Average)]);
                    } else {
                        debug.push(`No match for location in trend CSV: ${trendFilePath}`);
                    }

                } catch {
                    debug.push(`Trend CSV not found: ${trendFilePath}`);
                }
            }

            trend = trend.reverse();

        } catch (err) {
            debug.push(`Error processing pastPeriod: ${err}`);
            trend = [];
        }
    }

    return new Response(
        JSON.stringify({
            location: locationParam,
            value,
            measurement,
            name,
            trend
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
};