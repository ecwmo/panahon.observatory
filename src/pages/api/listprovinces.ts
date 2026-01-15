//npm install csv-parse fs
//npm install --save-dev @types/node

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

interface ProvinceData {
    province: string;
    model: string;
    TMEAN_C: string;
    ANOMALY_C: string;
    experiment: string;
    YEAR: string;
}

export function getProvincesAndModels() {
    // Path to CSV
    const csvPath = path.resolve("data/tables/provinces_TMean_Anomaly_V3_AllModels.csv");

    // Read CSV file
    const fileContent = fs.readFileSync(csvPath, "utf-8");

    // Parse CSV
    const records: ProvinceData[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
    });

    // Get unique values
    const provinces = Array.from(new Set(records.map(r => r.province))).sort();
    const models = Array.from(new Set(records.map(r => r.model))).sort();
    models.push("Multi-model");

    return { provinces, models };
}
