<template>
    <div class="legend">
        <!-- Folder tabs if alt style exists -->
        <div v-if="hasAltStyle" class="legend-header">
            <label class="legend-title">Select Range:</label>
            <div class="legend-slider">
                <button :class="{ active: !usingAltStyle }" @click="$emit('changeLegend', false)">
                    Global
                </button>
                <button :class="{ active: usingAltStyle }" @click="$emit('changeLegend', true)">
                    Local
                </button>
                <div class="slider-bg" :class="{ right: usingAltStyle }"></div>
            </div>
        </div>

        <!-- Gradient bar with hover marker + red line -->
        <div class="gradient-bar">
            <div class="gradient-fill" :style="gradientStyle"></div>

            <!-- Hover pixel marker (inside bar, halfway down, no arrow) -->
            <div v-if="hoveredValue !== null && hoveredValue !== undefined && hoveredValue !== '' && !isNaN(hoveredValue)"
                 class="hover-marker"
                 :style="{ left: pointerPosition + '%' }">
                <span class="hover-label">{{ hoveredValue }}{{ style.unit }}</span>
            </div>

            <!-- Red vertical line showing hover position -->
            <div v-if="hoveredValue !== null && hoveredValue !== undefined && hoveredValue !== '' && !isNaN(hoveredValue)"
                 class="hover-line"
                 :style="{ left: pointerPosition + '%' }"></div>

            <!-- Threshold tick lines (only if not discrete) -->
            <div v-if="!discrete"
                 v-for="(entry, idx) in style.ramp"
                 :key="'tick-' + idx"
                 class="tick-line"
                 :style="{ left: uniformTickPosition(idx) + '%' }"></div>
        </div>

        <!-- Threshold values with unit directly below segments -->
        <div class="threshold-values">
            <span v-for="(entry, idx) in style.ramp"
                  :key="'threshold-' + idx"
                  class="threshold-value"
                  :class="{
                      'edge-label-left': !discrete && idx === 0,
                      'edge-label-right': !discrete && idx === style.ramp.length - 1
                  }"
                  :style="{ left: (discrete ? discreteCenterPosition(idx) : uniformTickPosition(idx)) + '%' }">
                {{ entry.threshold }}{{ style.unit }}
            </span>
        </div>

        <!-- Legend labels below threshold values -->
        <div class="labels">
            <span v-for="(entry, idx) in style.ramp"
                  :key="'label-' + idx"
                  class="tick-label"
                  :class="{
                      'edge-label-left': !discrete && idx === 0,
                      'edge-label-right': !discrete && idx === style.ramp.length - 1
                  }"
                  :style="{ left: (discrete ? discreteCenterPosition(idx) : uniformTickPosition(idx)) + '%' }">
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
            hoveredValue: { type: Number, default: null },
            hasAltStyle: { type: Boolean, default: false },
            usingAltStyle: { type: Boolean, default: false },
            discrete: { type: Boolean, default: false }
        },
        computed: {
            gradientStyle() {
                const ramp = this.style.ramp;
                const colors = ramp.map(r => r.color);
                const n = ramp.length;

                if (this.discrete) {
                    const stops = [];
                    for (let i = 0; i < n; i++) {
                        const pctStart = (i / n) * 100;
                        const pctEnd = ((i + 1) / n) * 100;
                        stops.push(`${colors[i]} ${pctStart}%`, `${colors[i]} ${pctEnd}%`);
                    }
                    return {
                        background: `linear-gradient(to right, ${stops.join(", ")})`
                    };
                }
                else {
                    const scale = chroma.scale(colors).mode("lab");
                    const steps = 100;
                    const stops = [];
                    for (let i = 0; i <= steps; i++) {
                        const t = i / steps;
                        stops.push(`${scale(t).hex()} ${t * 100}%`);
                    }
                    return {
                        background: `linear-gradient(to right, ${stops.join(", ")})`
                    };
                }
            },
            pointerPosition() {
                if (this.hoveredValue == null) return 0;

                const thresholds = this.style.ramp.map(r => Number(r.threshold));
                const n = thresholds.length;
                const hv = Number(this.hoveredValue);

                if (!this.discrete) {
                    if (hv <= thresholds[0]) return 0;
                    if (hv >= thresholds[n - 1]) return 100;

                    for (let i = 0; i < n - 1; i++) {
                        const low = thresholds[i];
                        const high = thresholds[i + 1];
                        if (hv >= low && hv <= high) {
                            const fracWithinBin = (hv - low) / (high - low);
                            const fracAcrossLegend = (i + fracWithinBin) / (n - 1);
                            return fracAcrossLegend * 100;
                        }
                    }
                    return 0;
                }

                if (hv <= thresholds[0]) return (0.5 / n) * 100;
                if (hv >= thresholds[n - 1]) return ((n - 0.5) / n) * 100;

                for (let i = 0; i < n; i++) {
                    const t = thresholds[i];
                    if (hv === t) {
                        return ((i + 0.5) / n) * 100;
                    }
                }

                for (let i = 0; i < n - 1; i++) {
                    if (thresholds[i] === thresholds[i + 1] && hv === thresholds[i]) {
                        return ((i + 0.5) / n) * 100;
                    }
                }

                return 0;
            }
        },
        methods: {
            uniformTickPosition(idx) {
                const n = this.style.ramp.length;
                return (idx / (n - 1)) * 100;
            },
            discreteCenterPosition(idx) {
                const n = this.style.ramp.length;
                return ((idx + 0.5) / n) * 100;
            }
        }
    };
</script>

<style scoped>
    .legend {
        font-family: sans-serif;
        background: #f8f9fa;
        border: 1px solid #ccc;
        padding: 0.5rem;
        width: 100%;
        max-width: 600px;
        position: relative;
    }

    .legend-header {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        gap: 0.5rem;
    }

    .legend-title {
        font-size: 12px;
        margin: 0;
        color: #333;
    }

    .legend-slider {
        position: relative;
        display: inline-flex;
        background: #ddd;
        border-radius: 20px;
        overflow: hidden;
        width: 140px;
    }

    .legend-slider button {
        flex: 1;
        padding: 4px 0;
        border: none;
        background: transparent;
        font-size: 0.75rem;
        color: #333;
        cursor: pointer;
        z-index: 1;
    }

    .legend-slider button.active {
        color: #fff;
    }

    .slider-bg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 50%;
        background: #007bff;
        border-radius: 20px;
        transition: transform 0.3s ease;
        z-index: 0;
    }

    .slider-bg.right {
        transform: translateX(100%);
    }

    .gradient-bar {
        position: relative;
        height: 24px;
        border: 1px solid #999;
    }

    .gradient-fill {
        height: 100%;
        width: 100%;
    }

    .hover-marker {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }

    .hover-label {
        font-size: 0.8rem;
        background: #fff;
        padding: 0 3px;
        border: 1px solid #ccc;
        border-radius: 2px;
        white-space: nowrap;
    }

    .hover-line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        background: red;
        transform: translateX(-50%);
        z-index: 999;
    }

    .tick-line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        background: #000;
        transform: translateX(-50%);
    }

    .threshold-values {
        position: relative;
        margin-top: 0.25rem;
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

    .threshold-value.edge-label-left {
        transform: translateX(0);
    }

    .threshold-value.edge-label-right {
        transform: translateX(-100%);
    }

    .labels {
        position: relative;
        margin-top: 0.25rem;
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