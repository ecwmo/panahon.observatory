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
function getFilteredData(selectedProvince: string, projectedData: string, selectedModel: string) {
  let csvPath: string;

  if (projectedData === 'Temperature Anomaly') {
    csvPath = path.resolve('public/resources/climate/projected/tmean_v2.csv');
  } else if (projectedData === 'Rain Anomaly') {
    csvPath = path.resolve('public/resources/climate/projected/pr_v2.csv');
  } else {
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
  const yearExperimentMap = {}


  if (!selectedModel || selectedModel === 'Multi-model') {
    // Compute average across all models for each year & experiment
    const yearExperimentMap: Record<
      string, // province
      Record<string, Record<string, number[]>> // year -> experiment -> values
    > = {};

    filtered.forEach(r => {
      if (!yearExperimentMap[r.year]) yearExperimentMap[r.year] = {};
      if (!yearExperimentMap[r.year][r.experiment]) {
        yearExperimentMap[r.year][r.experiment] = [];
      }
      yearExperimentMap[r.year][r.experiment].push(Number(r.anomaly));
    });

    const mapped = filtered.map(r => ({
      province: r.province,
      year: r.year,
      data: Number(r.anomaly),
      experiment: r.experiment
    }));

    function computeProvinceAverages(province: string) {
      const provinceData = filtered.filter(r => r.province === province);

      const map: Record<string, Record<string, number[]>> = {};

      provinceData.forEach(r => {
        if (!map[r.year]) map[r.year] = {};
        if (!map[r.year][r.experiment]) map[r.year][r.experiment] = [];
        map[r.year][r.experiment].push(Number(r.anomaly));
      });

      // Compute averages and push to mapped
      Object.keys(map).forEach(year => {
        Object.keys(map[year]).forEach(experiment => {
          const values = map[year][experiment];
          const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

          mapped.push({
            province,     // <--- keep province separate
            year,
            data: avg,
            experiment
          });
        });
      });

      return map; // optional: could assign to yearExperimentMap if needed
    }
    const selectedMap = computeProvinceAverages(selectedProvince);
    const phMap = computeProvinceAverages('PH');
    return { mapped };
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
