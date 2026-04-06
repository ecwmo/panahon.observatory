<template>
  <div class="graph-container">
    <div class="top-rect">
      <div class="select period">
        <label v-for="item in keys" :key="item.value" class="radio-option">
          <input type="radio" name="timeframe" :value="item.value" v-model="selectedTimeFrame" />
          {{ item.label }}
        </label>
      </div>
      <div class="toggle national">
        <label class="radio-option">
          <input type="checkbox" name="nationalToggle" v-model="selectedNational" />
          Show national data
        </label>
      </div>
    </div>
    <div v-if="hasBackendError" class="bot-rect error-message">
      Backend error
    </div>
    <div v-else id="plot" class="bot-rect" style="width: 100%; white-space: nowrap"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
let Plotly: any = null

// ===================== TYPES =====================
interface FilteredDataItem {
  province: string
  year: string
  data: number
  experiment: string
}

interface ExperimentAverages {
  historical: number | null
  mid: number | null
  far: number | null
}

type HoverValues = Record<string, ExperimentAverages>


// ===================== PROPS =====================
const props = defineProps({
  selectedProvince: String,
  filteredData: {
    type: Array as () => FilteredDataItem[],
    default: () => [],
  },
  projectedData: String,
  yMin: {
    type: Number,
    default: 0,
  },
  yMax: {
    type: Number,
    default: 1,
  },
})


// ===================== STATE =====================

const hoverValues = ref<HoverValues>({})
const selectedNational = ref(false)
const selectedTimeFrame = ref('All')

// ===================== COMPUTED =====================

// Detect backend error flag
const hasBackendError = computed(() => {
  return (props.filteredData as any)?.failed === true
})

// Get min/max year range from dataset
const yearRange = computed(() => {
  const years = props.filteredData.map((d) => Number(d.year)).filter((y) => !Number.isNaN(y))

  if (!years.length) {
    return { start: 0, end: 0 }
  }

  return {
    start: Math.min(...years),
    end: Math.max(...years),
  }
})


// ===================== CONSTANTS =====================
const timeFrames = {
  historical: [1995, 2014],
  P1: [2015, 2034],
  P2: [2035, 2054],
  P3: [2055, 2074],
  P4: [2075, 2094],
  all: [2015, 2094],
} as const

// Display labels
const legendMap: Record<string, string> = {
  historical: 'Historical',
  ssp126: 'SSP1 - 2.6',
  ssp245: 'SSP2 - 4.5',
  ssp585: 'SSP5 - 8.5',
}

const legendMapNational: Record<string, string> = {
  historical_national: 'Historical (PH)',
  ssp126_national: 'SSP1 - 2.6 (PH)',
  ssp245_national: 'SSP2 - 4.5 (PH)',
  ssp585_national: 'SSP5 - 8.5 (PH)',
}

// Colors for traces
const colorPalette = [
  'rgb(56, 56, 56)',
  'rgb(125, 212, 43)',
  'rgb(243, 124, 27)',
  'rgb(233, 45, 39)',
  'rgb(141, 75, 8)',
  'rgb(154, 19, 207)',
]

// ===================== MAIN CHART =====================
async function renderChart() {
  // console.log('RenderChart called')
  if (!Plotly) {
    console.warn('Plotly not loaded yet')
    return
  }

  const labels = Array.from({ length: yearRange.value.end - yearRange.value.start + 1 }, (_, i) =>
    String(yearRange.value.start + i)
  )

  // Group data by experiment
  const grouped: Record<string, Record<string, number>> = {}
  props.filteredData
    .filter((item) => item.province === props.selectedProvince)
    .forEach((item) => {
      const exp = item.experiment
      const year = String(item.year)
      const val = Number(item.data)
      if (!grouped[exp]) grouped[exp] = {}
      grouped[exp][year] = val
    })

  const experiments = Object.keys(grouped).sort((a, b) => {
    if (a === 'historical') return -1
    if (b === 'historical') return 1
    return a.localeCompare(b)
  })

  const selected = selectedTimeFrame.value

  // ===================== BUILD LINE DATA =====================
  const experimentData = experiments.map((exp, i) => {
    const color = colorPalette[i % colorPalette.length]

    const visibleY: (number | null)[] = []
    const fadedY: (number | null)[] = []
    const miscY: (number | null)[] = []

    labels.forEach((yearStr) => {
      const year = Number(yearStr)
      const value = grouped[exp][yearStr] ?? null

      const timeframe = getTimeframeFromYear(year)
      if (selectedTimeFrame.value === 'All') {
        if (year === 1995 || year === 2095) {
          visibleY.push(value)
          fadedY.push(null)
          miscY.push(value)
        }
        if (timeframe != null) {
          visibleY.push(value)
          fadedY.push(null)
          miscY.push(null)
        } else {
          visibleY.push(null)
          fadedY.push(null)
          miscY.push(value)
        }
        return
      }

      const [selStart, selEnd] = timeFrames[selectedTimeFrame.value as keyof typeof timeFrames]

      const inSelected = year >= selStart && year <= selEnd

      if (inSelected) {
        visibleY.push(value)
        fadedY.push(value)
      } else {
        visibleY.push(null)
        fadedY.push(value)
      }
    })

    return { exp, color, visibleY, fadedY, miscY }
  })

  const experimentDataNational = displayNationalData(labels)

  const line1 = [
    // Provincial traces
    ...experimentData.flatMap(({ exp, color, visibleY, fadedY, miscY }) => [
      {
        x: labels,
        y: visibleY,
        type: 'scatter',
        mode: 'lines',
        name: legendMap[exp] || exp,
        legendgroup: exp,
        line: { color, width: 1 },
        meta: { baseOpacity: 1 },
        opacity: 1,
      },
      {
        x: labels,
        y: fadedY,
        type: 'scatter',
        mode: 'lines',
        showlegend: false,
        legendgroup: exp,
        line: { color, width: 1 },
        meta: { baseOpacity: 0.15 },
        opacity: 0.15,
        hoverinfo: 'skip',
      },
      {
        x: labels,
        y: miscY,
        type: 'scatter',
        mode: 'lines',
        showlegend: false,
        legendgroup: exp,
        line: { color, width: 1 },
        meta: { baseOpacity: 1, isMisc: true },
        opacity: 1,
        hoverinfo: 'skip',
      },
    ]),
    // National traces (dashed lines)
    ...(selectedNational.value
      ? experimentDataNational.flatMap(({ exp, color, visibleY, fadedY, miscY }) => [
          {
            x: labels,
            y: visibleY,
            type: 'scatter',
            mode: 'lines',
            name: (legendMap[exp] || exp) + ' (PH)',
            legendgroup: exp + '_national',
            line: { color, width: 1, dash: 'dot' },
            meta: { baseOpacity: 1 },
            opacity: 1,
          },
          {
            x: labels,
            y: fadedY,
            type: 'scatter',
            mode: 'lines',
            showlegend: false,
            legendgroup: exp + '_national',
            line: { color, width: 1, dash: 'dot' },
            meta: { baseOpacity: 0.15 },
            opacity: 0.15,
            hoverinfo: 'skip',
          },
          {
            x: labels,
            y: miscY,
            type: 'scatter',
            mode: 'lines',
            showlegend: false,
            legendgroup: exp + '_national',
            line: { color, width: 1, dash: 'dot' },
            meta: { baseOpacity: 1, isMisc: true },
            opacity: 1,
            hoverinfo: 'skip',
          },
        ])
      : []),
  ]

  const boxData = experimentData.map(({ exp, color, visibleY }) => ({
    y: visibleY.filter((v) => v !== null).map((v) => Number(v.toFixed(1))),
    type: 'box',
    name: exp,
    legendgroup: exp,
    showlegend: false,
    boxpoints: 'outliers',
    marker: { color },
    line: { color, width: 1 },
    xaxis: 'x2',
    yaxis: 'y2',
    width: 0.4,
  }))

  // ===================== AXIS LABEL =====================
  let yAxisTitle = ''
  let hoverTitle = ''
  let hoverUnits = ''

  if (props.projectedData === 'Temperature Anomaly') {
    yAxisTitle = 'Temperature Anomaly (°C)'
    hoverTitle = 'Average temperature anomaly'
    hoverUnits = '°C'
  } else if (props.projectedData === 'Rain Anomaly') {
    yAxisTitle = 'Rainfall Anomaly (%)'
    hoverTitle = 'Average rain anomaly'
    hoverUnits = '%'

  } else {
    yAxisTitle = props.projectedData || ''
  }

  // ===================== LAYOUT =====================
  const layout = {
    margin: { t: 60, b: 30, l: 70, r: 40 },
    title: `Historical and Projected ${props.projectedData} for the province of ${props.selectedProvince ?? 'Unknown'}`,
    grid: {
      rows: 1,
      columns: 2,
      pattern: 'independent',
    },
    xaxis: {
      title: '',
      domain: [0, 0.93],
      showticklabels: true,
      automargin: false,
    },
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: 1.05,
      yanchor: 'top'
    },
    autosize: true,
    yaxis: {
      title: yAxisTitle,
      font: {
        size: 14,
        family: 'Arial, sans-serif',
        color: '#000',
      },
    },
    xaxis2: {
      title: '',
      domain: [0.94, 1],
      showticklabels: false,
      automargin: false,
    },
    yaxis2: {
      matches: 'y',
      side: 'right',
      title: {
        text: '',
        font: {
          size: 14,
          family: 'Arial, sans-serif',
          color: '#000',
          // NOTE: font-weight is not supported in Plotly
        },
      },
      range: [props.yMin ?? 0, props.yMax ?? 1],
      autorange: false,
      fixedrange: true,
      zeroline: false,
      showticklabels: false,
      showgrid: false,
    },
    boxmode: 'group',
  }

  // ===================== DRAW =====================
  Plotly.newPlot('plot', [...line1, ...boxData], layout, { responsive: true, displayModeBar: false })
  // console.log('Created new combination plot')

  const plot = document.getElementById('plot')

  // Fade all traces except the hovered experiment
  function fadeOthers(activeGroup) {
    const opacities = plot.data.map((trace) => {
      const base = trace.meta?.baseOpacity ?? 1
      if (trace.meta?.isMisc) {
        // miscY lines always fade when hovering anything
        return 0.15
      }
      if (trace.legendgroup === activeGroup) {
        return base
      }

      return base * 0.15
    })

    Plotly.restyle(plot, { opacity: opacities })
  }

  // Restore full opacity
  function resetOpacity() {
    const opacities = plot.data.map((trace) => trace.meta?.baseOpacity ?? 1)

    Plotly.restyle(plot, { opacity: opacities })
  }

  // Hover in
  plot.on('plotly_hover', (event) => {
    const trace = event.points[0].data
    const point = event.points[0]
    const x = point.x
    const y = point.y
    const exp = trace.legendgroup
    fadeOthers(exp)
    let timeframe: string | null = null
    let avg: number | null = null

    if (trace.type === 'box') {
      Plotly.restyle(
        plot,
        {
          hovertemplate:
            '<b>%{fullData.name}</b><br>' +
            'Median: %{median:.2f}<br>' +
            'Q1: %{q1:.2f}<br>' +
            'Q3: %{q3:.2f}' +
            '<extra></extra>',
        },
        [curveNumber]
      )

      return
    }

    if (selectedTimeFrame.value === 'All') {
      timeframe = getTimeframeFromYear(Number(x))
      if (timeframe === 'historical') {
        avg = timeframe ? hoverValues.value[exp]?.[timeframe as keyof (typeof hoverValues.value)[typeof exp]] : null
      } else {
        timeframe = 'all'
        avg = hoverValues.value[exp]?.all ?? null
      }
    } else {
      timeframe = getTimeframeFromYear(Number(x))
      avg = timeframe ? hoverValues.value[exp]?.[timeframe as keyof (typeof hoverValues.value)[typeof exp]] : null
    }

    const timeframeLabel =
      timeframe && timeFrames[timeframe as keyof typeof timeFrames]
        ? `${timeFrames[timeframe as keyof typeof timeFrames][0]} - ${
            timeFrames[timeframe as keyof typeof timeFrames][1]
          }`
        : timeframe ?? 'N/A'

    const isNational = trace.legendgroup?.endsWith('_national')
    let hoverText: string
    if (isNational) {
      hoverText =
        `Philippines<br>` +
        //`Y value = ${y?.toFixed(2) ?? 'N/A'}°C<br>` +
        //`X value = ${x?.toFixed(2) ?? 'N/A'}°C<br>` +
        `Timeframe = ${timeframeLabel}<br>` +
        `Scenario = ${legendMapNational[exp] || exp}<br>` +
        `${hoverTitle} = ${avg ?? 'N/A'} ${hoverUnits}<extra></extra>`
    } else {
      hoverText =
        `Province = ${props.selectedProvince}<br>` +
        //`Y value = ${y?.toFixed(2) ?? 'N/A'}°C<br>` +
        //`X value = ${x?.toFixed(2) ?? 'N/A'}°C<br>` +
        `Timeframe = ${timeframeLabel}<br>` +
        `Scenario = ${legendMap[exp] || exp}<br>` +
        `${hoverTitle} = ${avg ?? 'N/A'} ${hoverUnits}<extra></extra>`
    }
    Plotly.restyle(plot, { hovertemplate: hoverText }, [point.curveNumber])

    if (avg != null) {
      Plotly.relayout(plot, {
        'shapes[0]': {
          type: 'line',
          x0: 0,
          x1: 1,
          xref: 'paper',
          y0: avg,
          y1: avg,
          yref: 'y',
          line: {
            color: trace.line?.color || 'black',
            width: 1,
            dash: 'dash',
          },
          layer: 'above',
        },
      })
    }
  })

  // Hover out
  plot.on('plotly_unhover', () => {
    resetOpacity()
    Plotly.relayout(plot, { 'shapes[0]': null })
  })
}

//////////////////// HANDLE NATIONAL DATA /////////////////////////

function displayNationalData(labels: string[]) {
  const groupedNational: Record<string, Record<string, number>> = {}
  props.filteredData
    .filter((item) => item.province === 'PH')
    .forEach((item) => {
      const exp = item.experiment
      const year = String(item.year)
      const val = Number(item.data)
      if (!groupedNational[exp]) groupedNational[exp] = {}
      groupedNational[exp][year] = val
    })

  const experimentsNational = Object.keys(groupedNational).sort((a, b) => {
    if (a === 'historical') return -1
    if (b === 'historical') return 1
    return a.localeCompare(b)
  })

  const experimentDataNational = experimentsNational.map((exp, i) => {
    const color = colorPalette[i % colorPalette.length]

    const visibleY: (number | null)[] = []
    const fadedY: (number | null)[] = []
    const miscY: (number | null)[] = []

    labels.forEach((yearStr) => {
      const year = Number(yearStr)
      const value = groupedNational[exp][yearStr] ?? null

      const timeframe = getTimeframeFromYear(year)
      if (selectedTimeFrame.value === 'All') {
        if (timeframe != null) {
          visibleY.push(value)
          fadedY.push(null)
          miscY.push(null)
        } else {
          visibleY.push(null)
          fadedY.push(null)
          miscY.push(value)
        }
        return
      }

      const [selStart, selEnd] = timeFrames[selectedTimeFrame.value as keyof typeof timeFrames]

      const inSelected = year >= selStart && year <= selEnd

      if (inSelected) {
        visibleY.push(value)
        fadedY.push(null)
      } else {
        visibleY.push(null)
        fadedY.push(value)
      }
    })
    return { exp, color, visibleY, fadedY, miscY }
  })
  return experimentDataNational
}

//////////////// PLOTLY GRAPH FUNCTIONS ///////////////////

function computeHoverValues(data: FilteredDataItem[], selectedProvince: string): HoverValues {
  const result: HoverValues = {}

  const allData = data.filter((item) => item.province === selectedProvince || item.province === 'PH')

  for (const item of allData) {
    const year = Number(item.year)
    let exp = item.experiment
    if (item.province === 'PH') {
      exp += '_national' // differentiate national
    }

    if (!result[exp]) {
      result[exp] = {
        historical: null,
        P1: null,
        P2: null,
        P3: null,
        P4: null,
        all: null,
      }
    }

    for (const [key, [start, end]] of Object.entries(timeFrames)) {
      if (year >= start && year <= end) {
        const current = result[exp][key as keyof ExperimentAverages]

        if (current === null) {
          result[exp][key as keyof ExperimentAverages] = Number(item.data)
        } else {
          result[exp][key as keyof ExperimentAverages]! += Number(item.data)
        }
        // Track counts separately
        const countKey = `${key}Count`
        ;(result[exp] as any)[countKey] = ((result[exp] as any)[countKey] || 0) + 1
      }
    }
  }

  // Finalize averages
  for (const exp of Object.keys(result)) {
    for (const key of ['historical', 'P1', 'P2', 'P3', 'P4', 'all'] as const) {
      const countKey = `${key}Count`
      const count = (result[exp] as any)[countKey] || 0

      if (count > 0) {
        result[exp][key]! = Number((result[exp][key]! / count).toFixed(1))
      } else {
        result[exp][key] = null
      }

      delete (result[exp] as any)[countKey]
    }
  }

  return result
}

function getTimeframeFromYear(year: number) {
  if (year >= 1995 && year <= 2014) return 'historical'
  if (year >= 2015 && year <= 2034) return 'P1'
  if (year >= 2035 && year <= 2054) return 'P2'
  if (year >= 2055 && year <= 2074) return 'P3'
  if (year >= 2075 && year <= 2094) return 'P4'
  return null
}

const keys = [
  { value: 'All', label: 'All' },
  { value: 'P1', label: '2015-2034' },
  { value: 'P2', label: '2035-2054' },
  { value: 'P3', label: '2055-2074' },
  { value: 'P4', label: '2075-2094' },
]


// On mounted, render chart
onMounted(async () => {
  // debug (props.filteredData as any).failed = true
  // <-- make the function async
  const plotlyModule = await import('plotly.js-dist-min')
  Plotly = plotlyModule.default

  if (props.filteredData.length) {
    hoverValues.value = computeHoverValues(props.filteredData, props.selectedProvince)
    renderChart()
  }
})
// Watch for reactive updates
watch(
  () => props.filteredData,
  (newData) => {
    hoverValues.value = computeHoverValues(newData, props.selectedProvince)
    if (newData.length) renderChart()
  },
  { deep: true }
)

watch(selectedTimeFrame, () => {
  renderChart()
})

watch(selectedNational, () => {
  renderChart()
})
</script>

<style scoped>
.graph-container {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%; /* fill panel height */
  width: 100%;
  gap: 0;
}

.top-rect {
  flex: 0 0 2rem;
  background: #ffffff; /* white background */
  border-bottom: 1px solid #ccc;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 5%;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
  flex-wrap: nowrap;
}
.select.period {
  display: flex; /* make children horizontal */
  gap: 1rem; /* spacing between radio buttons */
  flex-wrap: wrap; /* optional: wrap to next line if screen is too small */
  align-items: center; /* vertically center radio inputs and labels */
}
.bot-rect {
  flex: 1; /* takes remaining space */
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

#boxPlot {
  background-color: #ffffff;
}
.line-chart {
  flex: 8;
  height: 100%;
}
.box-plot {
  flex: 2; /* Take 3 parts of horizontal space in flex container */
  height: 100%; /* Fill the height of parent container */
}

.radio-option {
  color: black;
  flex: none; /* every option takes equal width */
  display: flex; /* allow inner content to stretch */
  justify-content: left; /* center text horizontally */
}

.radio-option input {
  margin-right: 0.5rem; /* space between checkbox and text */
}

.error-message {
  color: #b00020;
  background: #fff0f0;
  font-weight: bold;
  font-size: 1rem;
}
</style>
