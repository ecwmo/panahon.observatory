import type { APIRoute } from 'astro';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { loadClimateConfig, projectedCsvPath } from '@/lib/climate';
import { resourceDir } from '@/lib/helper/pages';

interface ProvinceData {
  province: string;
  model: string;
  value: string;
  anomaly: number;
  experiment: string;
  year: string;
}

// Function to filter CSV
function getFilteredData(selectedProvince: string, projectedData: string, selectedModel: string) {
  let csvPath: string;
  try {
    csvPath = projectedCsvPath(resourceDir, loadClimateConfig(resourceDir), projectedData);
  } catch {
    console.error('Invalid selectedMap value:', projectedData);
    return;
  }
  console.log('CSV Path:', csvPath);

  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  const records: ProvinceData[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  let filtered = records.filter(r => r.province === selectedProvince || r.province === "PH");
  if (!selectedModel || selectedModel === 'Multi-model') {
    const groups = new Map<string, { province: string; year: string; experiment: string; values: number[] }>();
    for (const record of filtered) {
      const key = `${record.province}|${record.year}|${record.experiment}`;
      const group = groups.get(key) ?? { province: record.province, year: record.year, experiment: record.experiment, values: [] };
      group.values.push(Number(record.anomaly));
      groups.set(key, group);
    }

    return {
      mapped: Array.from(groups.values(), group => ({
        province: group.province,
        year: group.year,
        data: group.values.reduce((sum, value) => sum + value, 0) / group.values.length,
        experiment: group.experiment,
      })),
    };
  }


  // Otherwise → filter by specific model
  filtered = filtered.filter(r => r.model === selectedModel);

  // Map to frontend shape
  const mapped = filtered.map(r => ({
    year: r.year,
    data: r.anomaly,
    experiment: r.experiment
  }));

  return {
    mapped,
    yearExperimentMap: {}
  };
  //return filtered.map(r => ({
  //  year: r.year,
  //  data: r.ANOMALY_C, // make sure this is a number, not string
  //experiment: r.experiment
  //}));
  //return filtered.map(r => ({ year: r.year, data: r.ANOMALY_C }));
}

// Astro GET endpoint
export const GET: APIRoute = ({ url }) => {
  const province = url.searchParams.get('province') || '';
  const model = url.searchParams.get('model') || '';
  const projectedData = url.searchParams.get('projectedData') || '';

  if (!province) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const data = getFilteredData(province, projectedData, model);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
