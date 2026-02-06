<template>
  <div class="graph-container">
    <!--
    <h3>Graph Projection</h3>
    <p><strong>Province:</strong> {{ selectedProvince }}</p>
    -->
    <div id="plot" style="width: 100%; height: 100%; white-space: nowrap"></div>
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
    baseline: number | null
    mid: number | null
    far: number | null
  }
  type HoverValues = Record<string, ExperimentAverages>
  const hoverValues = ref<HoverValues>({})

  const props = defineProps<{
    selectedProvince: string
    filteredData: FilteredDataItem[]
  }>()

  const mapBackground = ref<'baseline' | 'mid' | 'far' | null>(null)
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
      case 'baseline':
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

  function renderChartOld() {
    console.log('RenderChart called')

    const groupedByExperiment = props.filteredData.reduce(
      (acc, item) => {
        if (!acc[item.experiment]) {
          acc[item.experiment] = []
        }
        acc[item.experiment].push(item)
        return acc
      },
      {} as Record<string, FilteredDataItem[]>,
    )

    const labels = Array.from(
      { length: yearRange.value.end - yearRange.value.start + 1 },
      (_, i) => String(yearRange.value.start + i),
    )
    const experiments = Object.keys(groupedByExperiment).sort((a, b) => {
      if (a === 'historical') return -1
      if (b === 'historical') return 1
      return a.localeCompare(b)
    })

    if (myChart.value) {
      // Update existing chart
      console.log('myChart has a value')

      const datasets = experiments.map((experiment, index) => {
        const items = groupedByExperiment[experiment]

        return {
          label: experiment,
          data: labels.map((year) => {
            const found = items.find((item) => item.year === year)
            return found ? Number(found.data) : null
          }),
          backgroundColor: colorPalette[index % colorPalette.length],
          borderColor: colorPalette[index % colorPalette.length],
          fill: false,
          tension: 0.2,
          pointRadius: 3,
        }
      })
      const data = {
        labels,
        datasets,
      }
      myChart.value.options.plugins.title.text = `Projected Temperature Anomaly in ${props.selectedProvince}`
      myChart.value.data = data
      myChart.value.update('none') // <-- smoothly update the chart
      console.log('updated chart value')
      renderBoxPlot()
      console.log('Created new box plot')
      return
    }

    console.log('myChart has no value')
    // Create chart for the first time
    const datasets = experiments.map((experiment, index) => {
      const items = groupedByExperiment[experiment]


      return {
        label: experiment,
        data: labels.map((year) => {
          const found = items.find((item) => item.year === year)
          return found ? Number(found.data) : null
        }),
        backgroundColor: colorPalette[index % colorPalette.length],
        borderColor: colorPalette[index % colorPalette.length],
        fill: false,
        tension: 0.1,
        pointRadius: 3,
      }
    })

    const data = {
      labels,
      datasets,
    }

    const config = {
      type: 'line' as const,
      data,
      plugins: [hoverBackgroundPlugin, hoverAverageLinePlugin],
      options: {
        animation: {
          duration: 0,
        },
        interaction: {
          mode: 'nearest',
          intersect: true,
          axis: 'xy',
        },
        responsive: true,
        maintainAspectRatio: false,

        layout: {
          padding: {
            top: 5,
            bottom: 5,
            left: 5,
            right: 30,
          },
        },
        plugins: {
          title: {
            display: true,
            text: `Projected Temperature Anomaly in ${props.selectedProvince}`,
            font: {
              size: 24, // font size
              weight: 'bold', // bold text
            },
          },
          tooltip: {
            enabled: true,
            callbacks: {
              title: () => '',
              label: (context) => {
                const year = Number(context.label)
                const experiment = context.dataset.label // dataset = experiment
                const averages = hoverValues.value[experiment] // fetch the precomputed averages

                if (!averages) return null // safety check

                // Example: baseline period
                if (year >= 1981 && year <= 2015 && averages.baseline != null) {
                  return [
                    'Baseline period (1981–2015)',
                    `Scenario: ${experiment}`,
                    `Average anomaly: ${formatSigned(averages.baseline)} °C`,
                  ]
                }

                // Example: mid period
                if (year >= 2030 && year <= 2055 && averages.mid != null) {
                  return [
                    'Mid period (2030–2055)',
                    `Scenario: ${experiment}`,
                    `Average anomaly: ${formatSigned(averages.mid)} °C`,
                  ]
                }

                // Example: far period
                if (year >= 2056 && year <= 2080 && averages.far != null) {
                  return [
                    'far period (2056–2080)',
                    `Scenario: ${experiment}`,
                    `Average anomaly: ${formatSigned(averages.far)} °C`,
                  ]
                }

                return null // no tooltip if year not in any period
              },
            },

            // Prevent empty tooltip boxes
            filter: (context) => {
              const year = Number(context.label)
              return (year >= 1981 && year <= 2015) || (year >= 2030 && year <= 2080)
            },
          },
          legend: {
            labels: {
              // Generate legend labels based on the dataset's current color
              generateLabels: (chart) => {
                return chart.data.datasets.map((dataset: any, i: number) => ({
                  text: dataset.label,
                  fillStyle: dataset.borderColor, // <-- this uses the line's current color
                  strokeStyle: dataset.borderColor,
                  hidden: !chart.isDatasetVisible(i),
                  datasetIndex: i,
                }))
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year', // X-axis label
              font: {
                size: 18,
                weight: 'bold',
              },
            },
          },
          y: {
            min: -1.5, // fixed lower bound
            max: 5.5, // fixed upper bound
            ticks: {
              stepSize: 0.5, // only increments by 1
              callback: function (value) {
                return Number.isInteger(value) ? value : null
              },
            },
            title: {
              display: true,
              text: 'Temperature Anomaly (°C)', // Y-axis label
              font: {
                size: 18,
                weight: 'bold',
              },
            },
          },
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 10,
            pointStyle: false,
          },
          line: {
            borderWidth: 3,
            hitRadius: 0,
            hoverBorderWidth: 10,
          },
        },
        onHover: (event, activeElements, chart) => {
          const datasets = chart.data.datasets

          // If hovering over a dataset
          if (activeElements.length > 0) {
            const hoveredDatasetIndex = activeElements[0].datasetIndex
            const el = activeElements[0]
            const hoveredYear = Number(chart.data.labels![el.index])

            hoveredDatasetRef.value = hoveredDatasetIndex
            mapBackground.value = getPeriodFromYear(hoveredYear)

            datasets.forEach((dataset, i) => {
              const color = dataset.borderColor as string

              if (i === hoveredDatasetIndex) {
                dataset.borderColor = setAlpha(color, 1)
              } else {
                dataset.borderColor = setAlpha(color, 0.1)
              }
            })
            highlightBoxPlot(hoveredDatasetIndex)
          } else {
            // Reset opacity when not hovering

            hoveredDatasetRef.value = null
            mapBackground.value = null

            datasets.forEach((dataset) => {
              const color = dataset.borderColor as string
              dataset.borderColor = setAlpha(color, 1)
            })
            highlightBoxPlot(null)
          }

          chart.update('none') // no animation
        },
      },
    }

    const canvas = document.getElementById('myChart') as HTMLCanvasElement
    if (canvas) {
      myChart.value = new Chart(canvas, config)
      console.log('Created new chart')
      renderBoxPlot()
    }
  }

  function renderBoxPlot() {
    console.log('renderBoxPlot called')

    if (!Plotly) {
      console.warn('Plotly not loaded yet')
      return
    }

    const div = document.getElementById('boxPlot')
    if (!div) return

    // Group data by experiment
    const grouped: Record<string, number[]> = {}
    props.filteredData.forEach((item) => {
      const exp = item.experiment
      const val = Number(item.data)
      if (!grouped[exp]) grouped[exp] = []
      grouped[exp].push(val)
    })

    const experiments = Object.keys(grouped).sort((a, b) => {
      if (a === 'historical') return -1
      if (b === 'historical') return 1
      return a.localeCompare(b)
    })

    // Create Plotly traces
    const data = experiments.map((exp, idx) => ({
      y: grouped[exp],
      type: 'box',
      name: exp,
      boxpoints: 'outliers',
      marker: { color: colorPalette[idx % colorPalette.length] },
      line: { color: colorPalette[idx % colorPalette.length], width: 2 },
    }))

    const layout = {
      margin: { t: 85, b: 62, l: 50, r: 20 },
      yaxis: {
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
      },
      xaxis: {
        title: '', // no x-axis label
        showticklabels: true, // show the experiment names
        automargin: false, // automatically adjusts margins so labels fit
      },
      legend: true,
      showlegend: false,
      autosize: true,
      title: {
        text: '', //`Box Plot of Temperature Anomaly in ${props.selectedProvince}`,
        font: { size: 18 },
        xref: 'paper',
        x: 0.5,
        xanchor: 'center',
      },
    }

    Plotly.newPlot(div, data, layout, { responsive: true })
    console.log('Created new box plot')
  }

  function renderChart() {
    console.log('RenderChart called')
    if (!Plotly) {
      console.warn('Plotly not loaded yet')
      return
    }

    console.log('Start boxplotdata')


    // Group data by experiment
    const grouped: Record<string, number[]> = {}
    props.filteredData.forEach((item) => {
      const exp = item.experiment
      const val = Number(item.data)
      if (!grouped[exp]) grouped[exp] = []
      grouped[exp].push(val)
    })

    const experiments = Object.keys(grouped).sort((a, b) => {
      if (a === 'historical') return -1
      if (b === 'historical') return 1
      return a.localeCompare(b)
    })

    const x = [1, 2, 3, 4, 5];
    const y1 = [1,3,5,2,0
    ];
    const line1 = {
      x,
      y: y1,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Dataset A',
      line: { color: 'royalblue' },
      xaxis: 'x', // ← assign to first column
      yaxis: 'y',
      legendgroup: 'A'
    };

    // Create Plotly traces
    const boxData = experiments.map((exp, idx) => ({
      y: grouped[exp],
      type: 'box',
      name: exp,
      boxpoints: 'outliers',
      //use modulo to repeat colors of idx > colors.length
      marker: { color: colorPalette[idx % colorPalette.length] },
      line: { color: colorPalette[idx % colorPalette.length], width: 2 },
      xaxis: 'x2',  // ← assign to second column
      yaxis: 'y2' 
    }))

    const layout = {
      margin: { t: 85, b: 60, l: 70, r: 20 },
      title: 'Two Datasets: Lines (Left) & Boxes (Right)',
      grid: {
        rows: 1,
        columns: 2,
        pattern: 'independent'
      },
      xaxis: {
        title: '', // no x-axis label
        showticklabels: true, // show the experiment names
        automargin: false, // automatically adjusts margins so labels fit
      },
      legend: true,
      showlegend: false,
      autosize: true,
      title: {
        text: '', //`Box Plot of Temperature Anomaly in ${props.selectedProvince}`,
        font: { size: 18 },
        xref: 'paper',
        x: 0.5,
        xanchor: 'center',
      },
      yaxis: {
        title: 'Value'
      },
      xaxis2: {
        title: '', // no x-axis label
        showticklabels: true, // show the experiment names
        automargin: false, // automatically adjusts margins so labels fit
      },
      yaxis2: {
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
      legend: true,
      showlegend: false,
      autosize: true,
      title: {
        text: '', //`Box Plot of Temperature Anomaly in ${props.selectedProvince}`,
        font: { size: 18 },
        xref: 'paper',
        x: 0.5,
        xanchor: 'center',
      },
      boxmode: 'group'
    }

    Plotly.newPlot("plot", [line1, ...boxData], layout, { responsive: true })
    console.log('Created new combination plot')
  }

  function computeHoverValues(data: FilteredDataItem[]): HoverValues {
    const ranges = {
      baseline: [1981, 2015],
      mid: [2030, 2055],
      far: [2056, 2080],
    } as const

    const result: HoverValues = {}

    for (const item of data) {
      const year = Number(item.year)
      const exp = item.experiment

      if (!result[exp]) {
        result[exp] = {
          baseline: null,
          mid: null,
          far: null,
        }
      }

      for (const [key, [start, end]] of Object.entries(ranges)) {
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
      for (const key of ['baseline', 'mid', 'far'] as const) {
        const countKey = `${key}Count`
        const count = (result[exp] as any)[countKey] || 0

        if (count > 0) {
          result[exp][key]! /= count
        } else {
          result[exp][key] = null
        }

        delete (result[exp] as any)[countKey]
      }
    }

    return result
  }

  function setAlpha(color: string, alpha: number) {
    if (color.startsWith('rgba')) {
      return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, `rgba($1,$2,$3,${alpha})`)
    }

    if (color.startsWith('rgb')) {
      return color.replace('rgb', 'rgba').replace(')', `,${alpha})`)
    }

    return color // fallback
  }

  function highlightBoxPlot(activeIndex: number | null) {
    const div = document.getElementById('boxPlot')
    if (!div || !Plotly) return

    const traceCount = (div as any).data?.length ?? 0

    const opacities = Array.from({ length: traceCount }, (_, i) =>
      activeIndex === null ? 1 : i === activeIndex ? 1 : 0.15,
    )

    Plotly.restyle(div, { opacity: opacities })
  }

  function getPeriodFromYear(year: number) {
    if (year >= 1981 && year <= 2015) return 'baseline'
    if (year >= 2030 && year <= 2055) return 'mid'
    if (year >= 2056 && year <= 2080) return 'far'
    return null
  }

  function formatSigned(num: number) {
    return (num >= 0 ? '+' : '') + num.toFixed(2)
  }

  const hoverBackgroundPlugin = {
    id: 'hoverBackground',
    beforeDraw(chart: any) {
      const period = mapBackground.value
      if (!period) return

      const { ctx, chartArea, scales } = chart
      if (!chartArea) return

      const xScale = scales.x
      const { top, bottom, left } = chartArea

      const ranges: Record<string, { from: number; to: number; color: string; label: string }> = {
        baseline: {
          from: 1981,
          to: 2015,
          color: 'rgba(189,189,189,0.25)',
          label: 'Historical (1981–2015)',
        },
        mid: {
          from: 2030,
          to: 2055,
          color: 'rgba(244,163,196,0.25)',
          label: 'Mid Future (2030–2055)',
        },
        far: {
          from: 2056,
          to: 2080,
          color: 'rgba(211,47,47,0.25)',
          label: 'Far Future (2056–2080)',
        },
      }

      const { from, to, color, label } = ranges[period]

      const startX = xScale.getPixelForValue(String(from))
      const endX = xScale.getPixelForValue(String(to))
      const centerX = (startX + endX) / 2

      ctx.save()

      // 🔹 Background
      ctx.fillStyle = color
      ctx.fillRect(startX, top, endX - startX, bottom - top)

      // 🔹 Text label
      ctx.fillStyle = '#111'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(label, centerX, top + 8)

      ctx.restore()
    },
  }

  const hoverAverageLinePlugin = {
    id: 'hoverAverageLine',
    afterDraw(chart: any) {
      const datasetIndex = hoveredDatasetRef.value
      const period = mapBackground.value

      if (datasetIndex === null || !period) return

      const dataset = chart.data.datasets[datasetIndex]
      const exp = dataset.label
      const averages = hoverValues.value[exp]

      if (!averages) return

      const avgValue = averages[period as keyof ExperimentAverages]
      if (avgValue == null) return

      const { ctx, chartArea, scales } = chart
      const yScale = scales.y

      const y = yScale.getPixelForValue(avgValue)

      ctx.save()

      ctx.strokeStyle = dataset.borderColor
      ctx.lineWidth = 2
      ctx.setLineDash([6, 6]) // 🔹 dashed
      ctx.beginPath()
      ctx.moveTo(chartArea.left, y)
      ctx.lineTo(chartArea.right, y)
      ctx.stroke()

      ctx.restore()
    },
  }

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
</script>

<style scoped>
  #myChart {
    background-color: #ffffff;
  }
  .graph-container {
    padding: 1rem;
    display: flex;
    height: 100%;           /* fill panel height */
    width: 100%;
    gap: 1%;
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
</style>
