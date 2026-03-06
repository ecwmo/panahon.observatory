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
  'Historical: 1995 - 2014': { start: 1995, end: 2014 },
  '2015 - 2034': { start: 2015, end: 2034 },
  '2035 - 2054': { start: 2035, end: 2054 },
  '2055 - 2074': { start: 2055, end: 2074 },
  '2075 - 2094': { start: 2075, end: 2094 },
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
  let altstyle: Style;

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
      altstyle = {
        scaling: 'linear',
        ramp: [
          { color: '#fff7f7', label: 'Alt Lowest Anomaly' },
          { color: '#efc6c6', label: '' },
          { color: '#d66b6b', label: '' },
          { color: '#b52121', label: '' },
          { color: '#6b0808', label: 'Alt Highest Anomaly' }
        ],
        min: 0,
        max: 5,
        decimals: 2,
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
      altstyle = {
        scaling: 'linear',
        ramp: [
          { color: '#fff7f7', label: 'Alt Lowest Anomaly' },
          { color: '#efc6c6', label: '' },
          { color: '#d66b6b', label: '' },
          { color: '#b52121', label: '' },
          { color: '#6b0808', label: 'Alt Highest Anomaly' }
        ],
        min: 0,
        max: 5,
        decimals: 2,
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
          { color: '#f7fbff', label: 'Lowest Anomaly' },
          { color: '#c6dbef', label: '' },
          { color: '#6baed6', label: '' },
          { color: '#2171b5', label: '' },
          { color: '#08306b', label: 'Highest Anomaly' }
        ],
        min,
        max,
        decimals: 0,
        unit: 'mm',
      };
      altstyle = {
        scaling: 'linear',
        ramp: [
          { color: '#f7fbff', label: 'Alt Lowest Anomaly' },
          { color: '#c6dbef', label: '' },
          { color: '#6baed6', label: '' },
          { color: '#2171b5', label: '' },
          { color: '#08306b', label: 'Alt Highest Anomaly' }
        ],
        min: 0,
        max: 500,
        decimals: 1,
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
          { color: '#f7fbff', label: 'Lowest Anomaly' },
          { color: '#c6dbef', label: '' },
          { color: '#6baed6', label: '' },
          { color: '#2171b5', label: '' },
          { color: '#08306b', label: 'Highest Anomaly' }
        ],
        min,
        max,
        decimals: 0,
        unit: 'mm',
      };
      altstyle = {
        scaling: 'linear',
        ramp: [
          { color: '#f7fbff', label: 'Alt Lowest Anomaly' },
          { color: '#c6dbef', label: '' },
          { color: '#6baed6', label: '' },
          { color: '#2171b5', label: '' },
          { color: '#08306b', label: 'Alt Highest Anomaly' }
        ],
        min: 0,
        max: 500,
        decimals: 1,
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
      style,
      altstyle
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
    const { altstyle } = result.header;

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Scaling': style.scaling,
        'X-Ramp': JSON.stringify(style.ramp || []),
        'X-AltRamp': JSON.stringify(altstyle.ramp || []),
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
