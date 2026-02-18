<template>
  <div class="graph-container">
    <div class="top-rect">
      <label
        v-for="key in keys"
        :key="key"
        class="radio-option"
      >
        <input
          type="radio"
          name="timeframe"
          :value="key"
          v-model="selectedTimeFrame"
        />
        {{ key }}
      </label>
    </div>
    <div id="plot" class="bot-rect" style="width: 100%; white-space: nowrap"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, computed } from 'vue'
  import Chart from 'chart.js/auto'
  let Plotly: any = null

  // Define props
  interface FilteredDataItem {
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
  const hoverValues = ref<HoverValues>({})

  const props = defineProps<{
    selectedProvince: string
    filteredData: FilteredDataItem[]
  }>()

  const mapBackground = ref<'historical' | 'mid' | 'far' | null>(null)
  const hoveredDatasetRef = ref<number | null>(null)

  const colorPalette = [
    'rgb(56, 56, 56)',
    'rgb(125, 212, 43)',
    'rgb(243, 124, 27)',
    'rgb(233, 45, 39)',
    'rgb(141, 75, 8)',
    'rgb(154, 19, 207)',
  ]

  const mapColor = computed(() => {
    switch (mapBackground.value) {
      case 'historical':
        return '#bdbdbd'
      case 'mid':
        return '#f4a3c4'
      case 'far':
        return '#d32f2f'
      default:
        return 'transparent'
    }
  })

  const yearRange = computed(() => {
    const years = props.filteredData
      .map(d => Number(d.year))
      .filter(y => !Number.isNaN(y))

    if (!years.length) {
      return { start: 0, end: 0 }
    }

    return {
      start: Math.min(...years),
      end: Math.max(...years),
    }
  })

  const timeFrames = {
    historical: [1981, 2014],
    near: [2025, 2045],
    mid: [2046, 2065],
    far: [2066, 2085],
    all: [2025, 2085],
  } as const

  function renderChart() {
    console.log('RenderChart called')
    if (!Plotly) {
      console.warn('Plotly not loaded yet')
      return
    }

    console.log('Start boxplotdata')

    const labels = Array.from(
      { length: yearRange.value.end - yearRange.value.start + 1 },
      (_, i) => String(yearRange.value.start + i),
    )

    // Group data by experiment
    const grouped: Record<string, Record<string, number>> = {}
    props.filteredData.forEach((item) => {
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

    const experimentData = experiments.map((exp, i) => {
      const color = colorPalette[i % colorPalette.length]

      const visibleY: (number | null)[] = []
      const fadedY: (number | null)[] = []

      labels.forEach((yearStr) => {
        const year = Number(yearStr)
        const value = grouped[exp][yearStr] ?? null

        if (selectedTimeFrame.value === 'All') {
          visibleY.push(value)
          fadedY.push(null)
          return
        }

        const [selStart, selEnd] =
          timeFrames[selectedTimeFrame.value as keyof typeof timeFrames]

        const inSelected = year >= selStart && year <= selEnd

        if (inSelected) {
          visibleY.push(value)
          fadedY.push(null)
        } else {
          visibleY.push(null)
          fadedY.push(value)
        }
      })

      return { exp, color, visibleY, fadedY }
    })

    const line1 = experimentData.flatMap(({ exp, color, visibleY, fadedY }) => [
      {
        x: labels,
        y: visibleY,
        type: 'scatter',
        mode: 'lines',
        name: exp,
        legendgroup: exp,
        line: { color, width: 2 },
        meta: { baseOpacity: 1 },
        opacity: 1
      },
      {
        x: labels,
        y: fadedY,
        type: 'scatter',
        mode: 'lines',
        showlegend: false,
        legendgroup: exp,
        line: { color, width: 2 },
        meta: { baseOpacity: 0.15 },
        opacity: 0.15,
        hoverinfo: 'skip'
      }
    ])

    const boxData = experimentData.map(({ exp, color, visibleY }) => ({
      y: visibleY.filter(v => v !== null),
      type: 'box',
      name: exp,
      legendgroup: exp,
      boxpoints: 'outliers',
      marker: { color },
      line: { color, width: 2 },
      xaxis: 'x2',
      yaxis: 'y2',
      width: 0.4
    }))

    const layout = {
      margin: { t: 85, b: 60, l: 70, r: 80 },
      title: `Historical and Projected Temperature Anomaly °C for the province of ${props.selectedProvince ?? 'Unknown'}`,
      grid: {
        rows: 1,
        columns: 2,
        pattern: 'independent'
      },
      xaxis: {
        title: '', 
        domain: [0, 0.61],
        showticklabels: true, 
        automargin: false,
      },
      legend: true,
      showlegend: false,
      autosize: true,
      yaxis: {
        title: 'Temperature Anomaly °C',
        font: { 
          size: 14,
          family: 'Arial, sans-serif',
          color: '#000'
        }
      },
      xaxis2: {
        title: '',
        domain: [0.72, 1], 
        showticklabels: true, 
        automargin: false, 
      },
      yaxis2: {
        matches: 'y',
        side: 'right',
        title: {
          text: 'Temperature Anomaly °C',
          font: {
            size: 14,
            family: 'Arial, sans-serif',
            color: '#000',
            // NOTE: font-weight is not supported in Plotly
          },
        },
        range: [-1.8, 5.5],
        autorange: false,
        fixedrange: true,
        zeroline: false,
        matches: 'y',
        showticklabels: false
      },
      boxmode: 'group'
    }

    Plotly.newPlot("plot", [...line1, ...boxData], layout, { responsive: true,displayModeBar: false })
    console.log('Created new combination plot')

    const plot = document.getElementById('plot')


    // Fade all traces except the hovered experiment
    function fadeOthers(activeGroup) {
      const opacities = plot.data.map(trace => {
        const base = trace.meta?.baseOpacity ?? 1

        if (trace.legendgroup === activeGroup) {
          return base
        }

        return base * 0.15
      })

      Plotly.restyle(plot, { opacity: opacities })
    }

    // Restore full opacity
    function resetOpacity() {
      const opacities = plot.data.map(trace =>
        trace.meta?.baseOpacity ?? 1
      )

      Plotly.restyle(plot, { opacity: opacities })
    }

    // Hover in
    plot.on('plotly_hover', event => {
      const trace = event.points[0].data
      const point = event.points[0]
      const x = point.x
      const y = point.y
      const exp = trace.legendgroup
      fadeOthers(exp)
      let timeframe: string | null = null
      let avg: number | null = null

      if (selectedTimeFrame.value === 'All') {
        timeframe = getTimeframeFromYear(Number(x))
        if (timeframe ==='historical'){
          avg = timeframe
            ? hoverValues.value[exp]?.[timeframe as keyof typeof hoverValues.value[typeof exp]]
            : null
        }
        else{
          timeframe = 'all'
          avg = hoverValues.value[exp]?.all ?? null
        }
      } 
      else {
        timeframe = getTimeframeFromYear(Number(x))
        avg = timeframe
          ? hoverValues.value[exp]?.[timeframe as keyof typeof hoverValues.value[typeof exp]]
          : null
      }

      const hoverText =
        `Timeframe = ${timeframe}<br>` +
        //`X value = ${x}<br>` +
        //`Y value = ${y}<br>` +
        `Scenario = ${exp}<br>` +
        `Average temperature anomaly = ${avg ?? 'N/A'}°C<extra></extra>`;

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
              width: 2,
              dash: 'dash'
            },
            layer: 'above'
          }
        })
      }
    })


    // Hover out
    plot.on('plotly_unhover', () => {
      resetOpacity()
      Plotly.relayout(plot, { 'shapes[0]': null })
    })
  }

  //////////////// PLOTLY GRAPH FUNCTIONS ///////////////////

  function computeHoverValues(data: FilteredDataItem[]): HoverValues {
    const result: HoverValues = {}

    for (const item of data) {
      const year = Number(item.year)
      const exp = item.experiment

      if (!result[exp]) {
        result[exp] = {
          historical: null,
          near: null,
          mid: null,
          far: null,
          all: null
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
      for (const key of ['historical', 'near', 'mid', 'far', 'all'] as const) {
        const countKey = `${key}Count`
        const count = (result[exp] as any)[countKey] || 0

        if (count > 0) {
          result[exp][key]! = Number((result[exp][key]! / count).toFixed(2))
        } else {
          result[exp][key] = null
        }

        delete (result[exp] as any)[countKey]
      }
    }

    return result
  }

  function getTimeframeFromYear(year: number) {
    if (year >= 1981 && year <= 2014) return 'historical'
    if (year >= 2025 && year <= 2045) return 'near'
    if (year >= 2046 && year <= 2065) return 'mid'
    if (year >= 2065 && year <= 2085) return 'far'
    return null
  }


  const keys = ['All', 'near', 'mid', 'far']
  const selectedTimeFrame = ref('All')


  // On mounted, render chart
  onMounted(async () => {
    // <-- make the function async
    const plotlyModule = await import('plotly.js-dist-min')
    Plotly = plotlyModule.default

    if (props.filteredData.length) {
      hoverValues.value = computeHoverValues(props.filteredData)
      renderChart()
    }
  })
  // Watch for reactive updates
  watch(
    () => props.filteredData,
    (newData) => {
      hoverValues.value = computeHoverValues(newData)
      if (newData.length) renderChart()
    },
    { deep: true },
  )

  watch(selectedTimeFrame, () => {
    renderChart()    
  })
</script>

<style scoped>
  .graph-container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    height: 100%;           /* fill panel height */
    width: 100%;
    gap: 1%;
  }

  .top-rect {
    flex: 0 0 2rem;
    background: #ffffff;   /* white background */
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 5%;
    padding-left: 1rem;    
    padding-right: 1rem; 
  }

  .bot-rect {     
    flex: 1;                    /* takes remaining space */
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    color: #111827; /* text-gray-900 */
  }

  /* Body cells */
  .data-table td {
    background-color: transparent; /* transparent */
    color: #ffffff; /* white text */
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    text-align: center;
  }
  /* Header */
  .data-table th {
    background-color: #ffffff; /* white */
    color: #000000; /* black text */
    font-weight: bold;
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    text-align: center;
  }

  #boxPlot {
    background-color: #ffffff;
  } 
  .line-chart {
      flex: 7;
      height: 100%;
  }
  .box-plot {
    flex: 3;        /* Take 3 parts of horizontal space in flex container */
    height: 100%;   /* Fill the height of parent container */
  }
  
  .radio-option {
    color: black;
    flex: none;             /* every option takes equal width */
    display: flex;       /* allow inner content to stretch */
    justify-content: left; /* center text horizontally */
  }

  .radio-option input {
    margin-right: 0.5rem;  /* space between checkbox and text */
  }
</style>
