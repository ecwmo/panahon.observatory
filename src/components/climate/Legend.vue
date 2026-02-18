<template>
    <div class="legend">
        <!-- Gradient bar with hover marker + red line -->
        <div class="gradient-bar">
            <div class="gradient-fill" :style="gradientStyle"></div>

            <!-- Hover pixel marker (inside bar, halfway down, no arrow) -->
            <div v-if="hoveredValue"
                 class="hover-marker"
                 :style="{ left: pointerPosition + '%' }">
                <span class="hover-label">{{ hoveredValue }}{{ style.unit }}</span>
            </div>

            <!-- Red vertical line showing hover position -->
            <div v-if="hoveredValue"
                 class="hover-line"
                 :style="{ left: pointerPosition + '%' }"></div>

            <!-- Threshold tick lines -->
            <div v-for="(entry, idx) in style.ramp"
                 :key="'tick-' + idx"
                 class="tick-line"
                 :style="{ left: uniformTickPosition(idx) + '%' }"></div>
        </div>

        <!-- Threshold values with unit directly below ticks -->
        <div class="threshold-values">
            <span v-for="(entry, idx) in style.ramp"
                  :key="'threshold-' + idx"
                  class="threshold-value"
                  :class="{ 'edge-label-left': idx === 0, 'edge-label-right': idx === style.ramp.length - 1 }"
                  :style="{ left: uniformTickPosition(idx) + '%' }">
                {{ entry.threshold }}{{ style.unit }}
            </span>
        </div>

        <!-- Legend labels below threshold values -->
        <div class="labels">
            <span v-for="(entry, idx) in style.ramp"
                  :key="'label-' + idx"
                  class="tick-label"
                  :class="{ 'edge-label-left': idx === 0, 'edge-label-right': idx === style.ramp.length - 1 }"
                  :style="{ left: uniformTickPosition(idx) + '%' }">
                {{ entry.label }}
            </span>
        </div>
    </div>
</template>

<script>
    import chroma from "chroma-js";

    export default {
        name: "Legend",
        props: {
            style: { type: Object, required: true },
            hoveredValue: { type: Number, default: null }
        },
        computed: {
            gradientStyle() {
                const ramp = this.style.ramp;
                const colors = ramp.map(r => r.color);

                // Build chroma scale across ramp colors
                const scale = chroma.scale(colors).mode("lab");

                // Sample uniformly by index, not by threshold values
                const steps = 100;
                const stops = [];
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps; // fraction across ramp
                    stops.push(`${scale(t).hex()} ${t * 100}%`);
                }

                return {
                    background: `linear-gradient(to right, ${stops.join(", ")})`
                };
            },
            pointerPosition() {
                if (this.hoveredValue == null) return 0;

                const thresholds = this.style.ramp.map(r => r.threshold);
                const n = thresholds.length;

                if (this.hoveredValue <= thresholds[0]) return 0;
                if (this.hoveredValue >= thresholds[n - 1]) return 100;

                for (let i = 0; i < n - 1; i++) {
                    const low = thresholds[i];
                    const high = thresholds[i + 1];
                    if (this.hoveredValue >= low && this.hoveredValue <= high) {
                        const fracWithinBin = (this.hoveredValue - low) / (high - low);
                        const fracAcrossLegend = (i + fracWithinBin) / (n - 1);
                        return fracAcrossLegend * 100;
                    }
                }
                return 0;
            }
        },
        methods: {
            uniformTickPosition(idx) {
                const n = this.style.ramp.length;
                return (idx / (n - 1)) * 100;
            }
        }
    };
</script>

<style scoped>
    .legend {
        font-family: sans-serif;
        background: #f8f9fa;
        border: 1px solid #ccc;
        padding: 0.5rem; /* smaller padding */
        border-radius: 4px;
        width: 100%;
        max-width: 600px;
        position: relative;
    }

    .gradient-bar {
        position: relative;
        height: 24px; /* shorter bar */
        border: 1px solid #999;
    }

    .gradient-fill {
        height: 100%;
        width: 100%;
    }

    /* Hover pixel marker inside bar, halfway down */
    .hover-marker {
        position: absolute;
        top: 50%; /* halfway down the bar */
        transform: translate(-50%, -50%);
        z-index: 1000;
    }

    .hover-label {
        font-size: 0.8rem; /* smaller text */
        background: #fff;
        padding: 0 3px;
        border: 1px solid #ccc;
        border-radius: 2px;
        white-space: nowrap;
    }

    /* Red vertical line marker */
    .hover-line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        background: red;
        transform: translateX(-50%);
        z-index: 999;
    }

    /* Threshold tick lines */
    .tick-line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        background: #000;
        transform: translateX(-50%);
    }

    /* Threshold values with unit */
    .threshold-values {
        position: relative;
        margin-top: 0.25rem; /* tighter spacing */
        min-height: 1rem;
    }

    .threshold-value {
        position: absolute;
        font-size: 0.8rem;
        transform: translateX(-50%);
        white-space: nowrap;
        text-align: center;
        line-height: 1;
    }

    .edge-label-left {
        transform: translateX(0);
    }

    .edge-label-right {
        transform: translateX(-100%);
    }

    /* Legend labels below threshold values */
    .labels {
        position: relative;
        margin-top: 0.25rem; /* tighter spacing */
        min-height: 1rem;
    }

    .tick-label {
        position: absolute;
        font-size: 0.8rem;
        transform: translateX(-50%);
        white-space: nowrap;
        text-align: center;
        line-height: 1;
    }

    .tick-label.edge-label-left {
        transform: translateX(0);
    }

    .tick-label.edge-label-right {
        transform: translateX(-100%);
    }

    * {
        color: black;
    }
</style>