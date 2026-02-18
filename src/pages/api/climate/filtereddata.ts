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

// Function to filter CSV
function getFilteredData(selectedProvince: string, selectedModel?: string) {
  const csvPath = path.resolve('public/resources/climate/projected/provinces_TMean_Anomaly_V3_AllModels.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  const records: ProvinceData[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  let filtered = records.filter(r => r.province === selectedProvince);
  const yearExperimentMap = {}


  if (!selectedModel || selectedModel === 'Multi-model') {
    // Compute average across all models for each year & experiment
    const yearExperimentMap: Record<string, Record<string, number[]>> = {};

    filtered.forEach(r => {
      if (!yearExperimentMap[r.year]) yearExperimentMap[r.year] = {};
      if (!yearExperimentMap[r.year][r.experiment]) {
        yearExperimentMap[r.year][r.experiment] = [];
      }
      yearExperimentMap[r.year][r.experiment].push(Number(r.anomaly));
    });

    const mapped: { year: string; data: number; experiment: string }[] = [];

    Object.keys(yearExperimentMap).forEach(year => {
      Object.keys(yearExperimentMap[year]).forEach(experiment => {
        const values = yearExperimentMap[year][experiment];
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

        mapped.push({
          year,
          data: avg,
          experiment
        });
      });
    });

    return {
      mapped,
      yearExperimentMap
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
    yearExperimentMap
  };
  //return filtered.map(r => ({
  //  year: r.year,
  //  data: r.ANOMALY_C, // make sure this is a number, not string
  experiment: r.experiment
  //}));
  //return filtered.map(r => ({ year: r.year, data: r.ANOMALY_C }));
}

// Astro GET endpoint
export const GET: APIRoute = ({ url }) => {
  const province = url.searchParams.get('province') || '';
  const model = url.searchParams.get('model') || '';

  if (!province) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const data = getFilteredData(province, model);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
