import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface ProvinceData {
  province: string;
  model: string;
  value: string;
  anomaly: number;
  experiment: string;
  year: string;
}

const PERIODS: Record<string, { start: number; end: number }> = {
  'Historical: 1981 - 2015': { start: 1981, end: 2015 },
  'Mid Future: 2030 - 2055': { start: 2030, end: 2055 },
  'Far Future: 2056 - 2080': { start: 2056, end: 2080 },
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

function getProvinceAveragesByPeriod(
  projectedData: string,
  projectedPeriod: string,
  scenario: string,
  selectedModel?: string
) {
  let csvPath: string;
  let style: Style;

  if (projectedData === 'Temperature Anomaly') {
    csvPath = path.resolve(
      'public/resources/climate/projected/provinces_TMean_Anomaly_V3_AllModels.csv'
    );

    style = {
      scaling: 'linear',
      ramp: [
        { color: '#fff7f7', label: 'Very Low' },
        { color: '#efc6c6', label: 'Low' },
        { color: '#d66b6b', label: 'Mid' },
        { color: '#b52121', label: 'High' },
        { color: '#6b0808', label: 'Very High' }
      ],
      min: null,
      max: null
    };

  } else if (projectedData === 'Rainfall Anomaly') {
    csvPath = path.resolve(
      'public/resources/climate/projected/provinces_PMean_Anomaly_V3_AllModels.csv'
    );

    style = {
      scaling: 'linear',
      ramp: [
        { color: '#f7fbff', label: 'Very Low' },
        { color: '#c6dbef', label: 'Low' },
        { color: '#6baed6', label: 'Mid' },
        { color: '#2171b5', label: 'High' },
        { color: '#08306b', label: 'Very High' }
      ],
      min: null,
      max: null
    };

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
      min: Math.min(...anomalies),
      max: Math.max(...anomalies),
      period: projectedPeriod,
      projectedData,
      style
    },
    data: provinces
  };
}


export const GET: APIRoute = ({ url }) => {
    try {
        const projectedData = url.searchParams.get('projectedData') ?? 'Temperature Anomaly';
        const projectedPeriod = url.searchParams.get('projectedPeriod');
        const scenario = url.searchParams.get('scenario');
        const model = url.searchParams.get('model') ?? undefined;

        const result = getProvinceAveragesByPeriod(projectedData, projectedPeriod, scenario, model);

        return new Response(JSON.stringify(result.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'X-Scaling': result.header.style.scaling,
                'X-Ramp': JSON.stringify(result.header.style.ramp || []),
                'X-Min': result.header.style.min !== null ? String(result.header.style.min) : '',
                'X-Max': result.header.style.max !== null ? String(result.header.style.max) : ''
            },
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: (err as Error).message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
