import fs from 'node:fs'
import path from 'node:path'

export type ClimateConfig = {
  climate: {
    provinces: { file: string }
    current: Record<string, {
      directory: string
      prefix: string
      baselineDirectory?: string
      baselinePattern?: string
    }>
    projected: {
      files: Record<string, string>
      periods: Record<string, { start: number; end: number }>
      scenarios: Record<string, string>
    }
  }
}

export function loadClimateConfig(resourceDirectory: string): ClimateConfig {
  return JSON.parse(fs.readFileSync(path.join(resourceDirectory, 'climate/config.json'), 'utf-8'))
}

export function resourcePath(resourceDirectory: string, relativePath: string) {
  const basePath = path.resolve(resourceDirectory)
  const resolvedPath = path.resolve(basePath, relativePath)
  if (!resolvedPath.startsWith(`${basePath}${path.sep}`)) throw new Error('Invalid resource path')

  return resolvedPath
}

export function projectedCsvPath(resourceDirectory: string, config: ClimateConfig, projectedData: string) {
  const relativePath = config.climate.projected.files[projectedData]
  if (!relativePath) throw new Error('Unsupported projectedData')

  return resourcePath(resourceDirectory, relativePath)
}

export function rasterPixelIndex(
  bounds: [number, number, number, number],
  width: number,
  height: number,
  lat: number,
  lon: number
) {
  const [minX, minY, maxX, maxY] = bounds
  if (lon < minX || lon >= maxX || lat < minY || lat >= maxY) return null

  return {
    x: Math.floor(((lon - minX) / (maxX - minX)) * width),
    y: Math.floor(((maxY - lat) / (maxY - minY)) * height),
  }
}

const monthIndexes: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

export function parseClimateMonth(value: string) {
  const match = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})$/.exec(value)
  if (!match) return null

  return new Date(Date.UTC(Number(match[2]), monthIndexes[match[1]], 1))
}

export function isValidCoordinate(lat: number, lon: number) {
  return Number.isFinite(lat) && Number.isFinite(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
}
