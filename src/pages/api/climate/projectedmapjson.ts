import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { readdir, writeFile, stat, readFile } from 'node:fs/promises';
import { resourceDir } from '@/lib/helper/pages';

interface ProvinceData {
  province: string;
  model: string;
  value: string;
  anomaly: number;
  experiment: string;
  year: string;
}

const PERIODS: Record<string, { start: number; end: number }> = {
  'Historical: 1981 - 2014': { start: 1981, end: 2014 },
  'Near Future: 2025 - 2045': { start: 2025, end: 2045 },
  'Mid Future: 2046 - 2065': { start: 2046, end: 2065 },
  'Far Future: 2066 - 2085': { start: 2066, end: 2085 },
};

const SCENARIO_DICT: Record<string, string> = {
  'Historical': 'historical',
  'SSP1 - 2.6': 'ssp126',
  'SSP2 - 4.5': 'ssp245',
  'SSP5 - 8.5': 'ssp585',
};

type Style = {
  scaling: 'linear';
  ramp: { color: string; label: string }[];
  min: number | null;
  max: number | null;
};

const SNAPSHOT_FILENAME = 'snapshotprojected.json';

type FileSnapshot = {
  datemodified: number;
  min: number;
  max: number;
};
type SnapshotFile = Record<string, FileSnapshot>;

async function getSnapshot(dir: string) {
  const files = await readdir(dir);
  const csvs = files.filter(f => f.endsWith('.csv'));
  const snapshot: Record<string, number> = {};
  for (const f of csvs) {
    const s = await stat(path.join(dir, f));
    snapshot[f] = s.mtimeMs;
  }
  return snapshot;
}


async function getProvinceAveragesByPeriod(
  projectedData: string,
  projectedPeriod: string,
  scenario: string,
  selectedModel?: string
) {
  let csvPath: string;
  let style: Style;

  if (projectedData === 'Temperature Anomaly') {
    csvPath = path.resolve(
      'public/resources/climate/projected/tmean_v2.csv'
    );

    const snapshotPath = path.join(
      path.dirname(csvPath),
      SNAPSHOT_FILENAME
    );
    const fileName = path.basename(csvPath);

    let snapshot: SnapshotFile = {};

    try {
      const raw = await readFile(snapshotPath, 'utf-8');
      snapshot = JSON.parse(raw);
    } catch {
      await writeFile(snapshotPath, JSON.stringify({}, null, 2));
      snapshot = {};
    }

    const stats = await stat(csvPath);
    const currentModified = stats.mtimeMs;

    const existing = snapshot[fileName];

    if (existing && existing.datemodified === currentModified) {
      const min = existing.min;
      const max = existing.max;

      style = {
        scaling: 'linear',
        ramp: [
          { color: '#fff7f7', label: 'Lowest Anomaly' },
          { color: '#efc6c6', label: '' },
          { color: '#d66b6b', label: '' },
          { color: '#b52121', label: '' },
          { color: '#6b0808', label: 'Highest Anomaly' }
        ],
        min,
        max,
        decimals: 1,
        unit: 'C',
      };

      console.log('[Snapshot] Using cached temp min/max');
    }
    else {
      const fileContent = fs.readFileSync(csvPath, 'utf-8');

      const records: ProvinceData[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      });

      const groupMap = new Map<string, number[]>();

      for (const r of records) {
        const key = `${r.province}|${r.year}|${r.experiment}`;
        if (!groupMap.has(key)) {
          groupMap.set(key, []);
        }
        groupMap.get(key)!.push(Number(r.anomaly));
      }

      const averages = Array.from(groupMap.values()).map(values =>
        values.reduce((a, b) => a + b, 0) / values.length
      );

      const min = Math.min(...averages);
      const max = Math.max(...averages);

      // 5️⃣ Update snapshot structure
      snapshot[fileName] = {
        datemodified: currentModified,
        min,
        max,
      };

      await writeFile(snapshotPath, JSON.stringify(snapshot, null, 2));

      style = {
        scaling: 'linear',
        ramp: [
          { color: '#fff7f7', label: 'Lowest Anomaly' },
          { color: '#efc6c6', label: '' },
          { color: '#d66b6b', label: '' },
          { color: '#b52121', label: '' },
          { color: '#6b0808', label: 'Highest Anomaly' }
        ],
        min,
        max,
        decimals: 1,
        unit: 'C',
      };

      console.log('[Snapshot] Recalculating temp min/max');
    }
  } else if (projectedData === 'Rain Anomaly') {
    csvPath = path.resolve(
      'public/resources/climate/projected/pr_v2.csv'
    );

    const snapshotPath = path.join(
      path.dirname(csvPath),
      SNAPSHOT_FILENAME
    );
    const fileName = path.basename(csvPath);

    let snapshot: SnapshotFile = {};

    try {
      const raw = await readFile(snapshotPath, 'utf-8');
      snapshot = JSON.parse(raw);
    } catch {
      await writeFile(snapshotPath, JSON.stringify({}, null, 2));
      snapshot = {};
    }

    const stats = await stat(csvPath);
    const currentModified = stats.mtimeMs;

    const existing = snapshot[fileName];

    if (existing && existing.datemodified === currentModified) {
      const min = existing.min;
      const max = existing.max;

      style = {
        scaling: 'linear',
        ramp: [
          { color: '#f7fbff', label: 'Very Low' },
          { color: '#c6dbef', label: 'Low' },
          { color: '#6baed6', label: 'Mid' },
          { color: '#2171b5', label: 'High' },
          { color: '#08306b', label: 'Very High' }
        ],
        min,
        max,
        decimals: 0,
        unit: 'mm',
      };

      console.log('[Snapshot] Using cached prep min/max');
    }
    else {
      const fileContent = fs.readFileSync(csvPath, 'utf-8');

      const records: ProvinceData[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      });

      const groupMap = new Map<string, number[]>();

      for (const r of records) {
        const key = `${r.province}|${r.year}|${r.experiment}`;
        if (!groupMap.has(key)) {
          groupMap.set(key, []);
        }
        groupMap.get(key)!.push(Number(r.anomaly));
      }

      const averages = Array.from(groupMap.values()).map(values =>
        values.reduce((a, b) => a + b, 0) / values.length
      );

      const min = Math.min(...averages);
      const max = Math.max(...averages);

      snapshot[fileName] = {
        datemodified: currentModified,
        min,
        max,
      };

      await writeFile(snapshotPath, JSON.stringify(snapshot, null, 2));

      style = {
        scaling: 'linear',
        ramp: [
          { color: '#f7fbff', label: 'Very Low' },
          { color: '#c6dbef', label: 'Low' },
          { color: '#6baed6', label: 'Mid' },
          { color: '#2171b5', label: 'High' },
          { color: '#08306b', label: 'Very High' }
        ],
        min,
        max,
        decimals: 0,
        unit: 'mm',
      };

      console.log('[Snapshot] Recalculating prep min/max');
    }
  } else {
    throw new Error('Unsupported projectedData');
  }

  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  const records: ProvinceData[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  const period = PERIODS[projectedPeriod];
  if (!period) throw new Error('Invalid period');

  const experimentCode = SCENARIO_DICT[scenario];
  if (!experimentCode) throw new Error('Unsupported scenario');


  // Filter by year and scenario
  let filtered = records.filter(r => {
    const year = Number(r.year);
    return year >= period.start && year <= period.end && r.experiment === experimentCode;
  });

  // Optional model filter
  if (selectedModel && selectedModel !== 'Multi-model') {
    filtered = filtered.filter(r => r.model === selectedModel);
  }

  // Aggregate by province
  const provinceMap: Record<string, number[]> = {};
  filtered.forEach(r => {
    if (!provinceMap[r.province]) provinceMap[r.province] = [];
    provinceMap[r.province].push(Number(r.anomaly));
  });

  const provinces = Object.entries(provinceMap).map(([province, values]) => ({
    province,
    averageAnomaly: values.reduce((sum, v) => sum + v, 0) / values.length
  }));

  const anomalies = provinces.map(p => p.averageAnomaly);

  return {
    header: {
      period: projectedPeriod,
      projectedData,
      style
    },
    data: provinces
  };
}


export const GET: APIRoute = async ({ url }) => {
  try {
    const projectedData = url.searchParams.get('projectedData') ?? 'Temperature Anomaly';
    const projectedPeriod = url.searchParams.get('projectedPeriod');
    const scenario = url.searchParams.get('scenario');
    const model = url.searchParams.get('model') ?? undefined;

    const result = await getProvinceAveragesByPeriod(projectedData, projectedPeriod, scenario, model);
    const { style } = result.header;

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Scaling': style.scaling,
        'X-Ramp': JSON.stringify(style.ramp || []),
        'X-Min': String(style.min),
        'X-Max': String(style.max),
        'X-Decimals': String(style.decimals),
        'X-Unit': String(style.unit),
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
