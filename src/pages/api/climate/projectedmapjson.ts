import type { APIRoute } from 'astro'
import fs from 'node:fs'

import { parse } from 'csv-parse/sync'

import { loadClimateConfig, projectedCsvPath } from '@/lib/climate'
import { resourceDir } from '@/lib/helper/pages'

interface ProvinceData {
  province: string
  model: string
  anomaly: number
  experiment: string
  year: string
}

type Ramp = { color: string; label: string }

type Style = {
  scaling: string
  ramp: Ramp[]
  min: number
  max: number
  graphmin: number
  graphmax: number
  decimals: number
  unit: string
}

type AltStyle = {
  scaling: string
  ramp: Ramp[]
  altmin: number
  altmax: number
  decimals: number
  unit: string
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function ranges(
  records: ProvinceData[],
  selectedProvinceAverages: number[],
  periods: Record<string, { start: number; end: number }>
) {
  const periodValues = new Map<string, number[]>()
  const yearlyValues = new Map<string, number[]>()

  for (const record of records) {
    const year = Number(record.year)
    const periodEntry = Object.entries(periods).find(([, range]) => year >= range.start && year <= range.end)

    if (periodEntry) {
      const [periodName] = periodEntry
      const key = `${record.province}|${record.experiment}|${periodName}`
      const values = periodValues.get(key) ?? []
      values.push(Number(record.anomaly))
      periodValues.set(key, values)
    }

    const yearlyKey = `${record.province}|${record.year}|${record.experiment}`
    const values = yearlyValues.get(yearlyKey) ?? []
    values.push(Number(record.anomaly))
    yearlyValues.set(yearlyKey, values)
  }

  const periodAverages = Array.from(periodValues.values(), average)
  const yearlyAverages = Array.from(yearlyValues.values(), average)

  return {
    min: Math.min(...periodAverages),
    max: Math.max(...periodAverages),
    graphmin: Math.min(...yearlyAverages),
    graphmax: Math.max(...yearlyAverages),
    altmin: Math.min(...selectedProvinceAverages),
    altmax: Math.max(...selectedProvinceAverages),
  }
}

function styleFor(
  projectedData: string,
  records: ProvinceData[],
  selectedProvinceAverages: number[],
  periods: Record<string, { start: number; end: number }>
) {
  const isTemperature = projectedData === 'Temperature Anomaly'
  const fullRamp = isTemperature
    ? [
        { color: '#F7F7F7', label: 'Lowest Anomaly' },
        { color: '#FDBDC7', label: '' },
        { color: '#F4A582', label: '' },
        { color: '#D6604D', label: '' },
        { color: '#B2182B', label: 'Highest Anomaly' },
      ]
    : [
        { color: '#F5F5F5', label: 'Lowest Anomaly' },
        { color: '#C7EAE5', label: '' },
        { color: '#80CDC1', label: '' },
        { color: '#35978F', label: '' },
        { color: '#01665E', label: 'Highest Anomaly' },
      ]
  const uniqueCount = new Set(selectedProvinceAverages.map(value => Number(value.toFixed(1)))).size
  const steps = Math.min(uniqueCount, fullRamp.length)
  const displayRamp =
    steps === 1
      ? [fullRamp[0]]
      : Array.from({ length: steps }, (_, index) => fullRamp[Math.round((index * (fullRamp.length - 1)) / (steps - 1))])
  const { min, max, graphmin, graphmax, altmin, altmax } = ranges(records, selectedProvinceAverages, periods)
  const unit = isTemperature ? '°C' : '%'

  return {
    style: {
      scaling: 'linear',
      ramp: fullRamp,
      min,
      max,
      graphmin,
      graphmax,
      decimals: isTemperature ? 1 : 0,
      unit,
    } satisfies Style,
    altstyle: {
      scaling: 'linear',
      ramp: displayRamp,
      altmin,
      altmax,
      decimals: 1,
      unit,
    } satisfies AltStyle,
  }
}

function getProvinceAveragesByPeriod(
  projectedData: string,
  projectedPeriod: string,
  scenario: string,
  selectedModel?: string
) {
  const config = loadClimateConfig(resourceDir)
  const csvPath = projectedCsvPath(resourceDir, config, projectedData)
  const records: ProvinceData[] = parse(fs.readFileSync(csvPath, 'utf-8'), {
    columns: true,
    skip_empty_lines: true,
  })
  const period = config.climate.projected.periods[projectedPeriod]
  if (!period) throw new Error('Invalid period')

  const experimentCode = config.climate.projected.scenarios[scenario]
  if (!experimentCode) throw new Error('Unsupported scenario')

  let filtered = records.filter(record => {
    const year = Number(record.year)
    return year >= period.start && year <= period.end && record.experiment === experimentCode
  })

  if (selectedModel && selectedModel !== 'Multi-model') {
    filtered = filtered.filter(record => record.model === selectedModel)
  }

  const provinceValues = new Map<string, number[]>()
  for (const record of filtered) {
    const values = provinceValues.get(record.province) ?? []
    values.push(Number(record.anomaly))
    provinceValues.set(record.province, values)
  }

  const data = Array.from(provinceValues, ([province, values]) => ({
    province,
    averageAnomaly: average(values),
  }))
  const { style, altstyle } = styleFor(
    projectedData,
    records,
    data.map(province => province.averageAnomaly),
    config.climate.projected.periods
  )

  return { style, altstyle, data }
}

export const GET: APIRoute = ({ url }) => {
  try {
    const projectedData = url.searchParams.get('projectedData') ?? 'Temperature Anomaly'
    const projectedPeriod = url.searchParams.get('projectedPeriod')
    const scenario = url.searchParams.get('scenario')
    const model = url.searchParams.get('model') ?? undefined
    const { style, altstyle, data } = getProvinceAveragesByPeriod(projectedData, projectedPeriod, scenario, model)
    const periodLabel = projectedPeriod.replace(/^Historical:\s*/, '')
    const title = `${projectedData} (${scenario}: ${periodLabel})`
    const altTitle = title

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Scaling': style.scaling,
        'X-Ramp': JSON.stringify(style.ramp),
        'X-AltRamp': JSON.stringify(altstyle.ramp),
        'X-Min': String(style.min),
        'X-Max': String(style.max),
        'X-GraphMin': String(style.graphmin),
        'X-GraphMax': String(style.graphmax),
        'X-AltMin': String(altstyle.altmin),
        'X-AltMax': String(altstyle.altmax),
        'X-Decimals': String(style.decimals),
        'X-Unit': style.unit,
        'X-Title': title,
        'X-AltTitle': altTitle,
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
