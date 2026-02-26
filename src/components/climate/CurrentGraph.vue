<template>
    <div class="graph-panel">
        <!-- Plot container always present -->
        <div id="trend-plot"></div>

        <!-- Unified overlay -->
        <div v-if="!data || rendering" class="overlay loading-message">
            {{ 'Rendering...' }}
        </div>

        <!-- Error overlay -->
        <div v-else-if="data && data.failed" class="overlay error-message">
            Backend error
        </div>
    </div>
</template>

<script>
    import { ref, onMounted, watch, nextTick, onBeforeUnmount } from "vue";

    export default {
        name: "CurrentGraph",
        props: {
            data: { type: Object, default: null }
        },
        setup(props) {
            let Plotly = null;
            let plotEl = null;
            let handleResize = null;
            const rendering = ref(false);

            const renderPlot = async (newVal) => {
                if (!newVal || !newVal.trend || !Plotly || !plotEl) return;

                const months = newVal.trend.map(item => item[0]);
                const values = newVal.trend.map(item => item[1]);
                const numericValues = values.filter(v => v !== null && !isNaN(v));

                const baselineMonths = newVal.baseline ? newVal.baseline.map(item => item[0]) : months;
                const baselineValues = newVal.baseline ? newVal.baseline.map(item => item[1]) : months.map(() => null);
                const baselineNumeric = baselineValues.filter(v => v !== null && !isNaN(v));

                const allValues = [...numericValues, ...baselineNumeric];
                let minVal = allValues.length ? Math.min(...allValues) : 0;
                let maxVal = allValues.length ? Math.max(...allValues) : 1;

                const posColor = newVal.positiveColor;
                const negColor = newVal.negativeColor;

                function hexToRgba(hex, alpha) {
                    const bigint = parseInt(hex.slice(1), 16);
                    const r = (bigint >> 16) & 255;
                    const g = (bigint >> 8) & 255;
                    const b = bigint & 255;
                    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                }

                let yRange;
                if (newVal.graph === "bar") {
                    const absMax = Math.max(...allValues.map(v => Math.abs(v)), 1);
                    yRange = [-absMax, absMax];
                }
                else {
                    const padding = Math.max(Math.abs(minVal), Math.abs(maxVal)) * 0.1;
                    yRange = [minVal - padding, maxVal + padding];
                }

                let traces = [];
                if (newVal.graph === "bar") {
                    const negVals = values.map(v => (v !== null && v < 0 ? v : null));
                    const posVals = values.map(v => (v !== null && v >= 0 ? v : null));

                    const negTrace = {
                        x: months,
                        y: negVals,
                        type: "bar",
                        marker: { color: negColor, opacity: 0.7 },
                        hovertemplate: "%{y}<extra></extra>",
                        name: newVal.negativeLegend || "Negative",
                        showlegend: numericValues.some(v => v < 0)
                    };

                    const posTrace = {
                        x: months,
                        y: posVals,
                        type: "bar",
                        marker: { color: posColor, opacity: 0.7 },
                        hovertemplate: "%{y}<extra></extra>",
                        name: newVal.positiveLegend || "Positive",
                        showlegend: numericValues.some(v => v >= 0)
                    };

                    const nullIndices = values
                        .map((v, i) => (v === null ? i : null))
                        .filter(i => i !== null);

                    const nullTraceNeg = {
                        x: nullIndices.map(i => months[i]),
                        y: nullIndices.map(() => yRange[0]),
                        base: 0,
                        type: "bar",
                        marker: {
                            color: "lightgrey",
                            opacity: 0.3,
                            pattern: {
                                shape: "/",
                                fillmode: "overlay",
                                size: 6,
                                solidity: 0.3
                            }
                        },
                        hovertemplate: "N/A<extra></extra>",
                        showlegend: false
                    };

                    const nullTracePos = {
                        x: nullIndices.map(i => months[i]),
                        y: nullIndices.map(() => yRange[1]),
                        base: 0,
                        type: "bar",
                        marker: {
                            color: "lightgrey",
                            opacity: 0.3,
                            pattern: {
                                shape: "/",
                                fillmode: "overlay",
                                size: 6,
                                solidity: 0.3
                            }
                        },
                        hovertemplate: "N/A<extra></extra>",
                        showlegend: false
                    };

                    traces.push(negTrace, posTrace, nullTraceNeg, nullTracePos);
                }
                else {
                    const trendTrace = {
                        x: months,
                        y: values,
                        type: "scatter",
                        mode: "lines+markers",
                        line: { color: hexToRgba(posColor, 0.7) },
                        marker: { size: 8, color: values.map(v => v < 0 ? negColor : posColor), opacity: 0.7 },
                        hovertemplate: "%{y}<extra></extra>",
                        name: "Current",
                        showlegend: numericValues.length > 0
                    };

                    const baselineTrace = {
                        x: baselineMonths,
                        y: baselineValues,
                        type: "scatter",
                        mode: "lines+markers",
                        line: { color: hexToRgba(newVal.baselinePositiveColor, 0.7) },
                        marker: { size: 8, color: baselineValues.map(v => v < 0 ? newVal.baselineNegativeColor : newVal.baselinePositiveColor), opacity: 0.7 },
                        hovertemplate: "%{y}<extra></extra>",
                        name: "Baseline",
                        showlegend: baselineNumeric.length > 0
                    };

                    traces.push(trendTrace, baselineTrace);
                }

                const layout = {
                    title: {
                        text: newVal.name || "Trend Data",
                        font: { size: 14 },
                        xref: "paper",
                        x: 0.5,
                        y: 0.95
                    },
                    margin: { t: 90, l: 80, r: 20, b: 80 },
                    autosize: true,
                    xaxis: {
                        title: "Month",
                        tickangle: -45,
                        automargin: true,
                        tickfont: { size: 12 }
                    },
                    yaxis: {
                        title: { text: newVal.measurement || "Value", font: { size: 14 } },
                        automargin: true,
                        range: yRange
                    },
                    legend: {
                        orientation: "h",
                        x: 0.5,
                        xanchor: "center",
                        yanchor: "bottom",
                        y: 1.0
                    },
                    ...(newVal.graph === "bar" ? { barmode: "overlay" } : {})
                };

                await Plotly.newPlot(plotEl, traces, layout, { responsive: true });

                await nextTick();
                if (plotEl && plotEl.offsetParent !== null) {
                    Plotly.Plots.resize(plotEl);
                }

                rendering.value = false;
            };

            onMounted(async () => {
                rendering.value = true;
                Plotly = (await import("plotly.js-dist")).default;
                plotEl = document.getElementById("trend-plot");

                if (props.data && !props.data.failed) {
                    renderPlot(props.data);
                }

                handleResize = () => {
                    if (Plotly && plotEl && plotEl.offsetParent !== null) {
                        Plotly.Plots.resize(plotEl);
                    }
                };
                window.addEventListener("resize", handleResize);
            });

            onBeforeUnmount(() => {
                if (handleResize) {
                    window.removeEventListener("resize", handleResize);
                }
                if (Plotly && plotEl) {
                    Plotly.purge(plotEl);
                }
            });

            watch(
                () => props.data,
                (newVal) => {
                    if (newVal && !newVal.failed) {
                        renderPlot(newVal);
                    }
                },
                { immediate: true }
            );

            return { rendering };
        }
    };
</script>

<style scoped>
    .graph-panel {
        position: relative;
        flex: 2;
        flex-basis: 0;
        display: flex;
        flex-direction: column;
        border-left: 1px solid #ccc;
        height: 100%;
        overflow: hidden;
        background: #f9f9f9;
    }

    #trend-plot {
        flex: 1;
        width: 100%;
        height: 100%;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        background: rgba(255, 255, 255, 0.8);
    }

    .error-message {
        color: #d9534f;
    }

    .loading-message {
        color: #666;
    }
</style>