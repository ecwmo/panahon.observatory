<template>
    <div class="graph-panel">
        <!-- show error if no data at all -->
        <div v-if="!data" class="error-message">
            Backend error
        </div>
        <!-- otherwise render plot container -->
        <div v-else id="trend-plot"></div>
    </div>
</template>

<script>
    import { onMounted, watch, nextTick, onBeforeUnmount } from "vue";

    export default {
        name: "CurrentGraph",
        props: {
            data: { type: Object, default: null }
        },
        setup(props) {
            let Plotly = null;
            let plotEl = null;
            let handleResize = null;

            const renderPlot = async (newVal) => {
                if (!newVal || !Plotly || !plotEl) return;

                // For now, just render a placeholder trace.
                // You can adapt this later depending on the actual structure of `data`.
                const trace = {
                    x: [],
                    y: [],
                    type: "scatter",
                    mode: "lines+markers",
                    line: { color: "#4dabf7" },
                    marker: { size: 8 },
                    hoverinfo: "skip"
                };

                const layout = {
                    title: {
                        text: newVal.name || "Trend Data",
                        font: { size: 20 },
                        xref: "paper",
                        x: 0.5,
                        y: 0.95
                    },
                    margin: { t: 80, l: 80, r: 20, b: 80 },
                    xaxis: { title: "X Axis" },
                    yaxis: { title: "Y Axis" }
                };

                await Plotly.newPlot(plotEl, [trace], layout, { responsive: true });

                await nextTick();
                if (plotEl && plotEl.offsetParent !== null) {
                    Plotly.Plots.resize(plotEl);
                }
            };

            onMounted(async () => {
                Plotly = (await import("plotly.js-dist")).default;
                plotEl = document.getElementById("trend-plot");

                if (props.data) {
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
                    if (newVal) {
                        renderPlot(newVal);
                    }
                },
                { immediate: true }
            );
        }
    };
</script>

<style scoped>
    .graph-panel {
        flex: 2;
        flex-basis: 0;
        display: flex;
        flex-direction: column;
        padding: 1rem;
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

    .error-message {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: #d9534f;
    }
</style>