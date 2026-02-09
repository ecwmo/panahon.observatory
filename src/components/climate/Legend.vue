<template>
    <div class="legend">
        <div class="gradient-bar">
            <div class="gradient-fill" :style="gradientStyle"></div>
            <div v-if="hoveredValue"
                 class="pointer"
                 :style="{ left: pointerPosition + '%' }">
                <span class="pointer-label">{{ hoveredValue }}{{ style.unit }}</span>
            </div>
            <div v-for="(entry, idx) in style.ramp"
                 :key="'tick-' + idx"
                 class="tick-line"
                 :style="{ left: uniformTickPosition(idx) + '%' }"></div>
        </div>
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
        padding: 1rem;
        border-radius: 4px;
        width: 100%;
        max-width: 600px;
    }

    .gradient-bar {
        position: relative;
        height: 30px;
        border: 1px solid #999;
    }

    .gradient-fill {
        height: 100%;
        width: 100%;
    }

    .pointer {
        position: absolute;
        bottom: -8px;
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 7px solid #000;
        transform: translateX(-50%);
        z-index: 1000;
    }

    .pointer-label {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.8rem;
        background: #fff;
        padding: 0 4px;
        border: 1px solid #ccc;
        border-radius: 2px;
        white-space: nowrap;
    }

    .tick-line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        background: #000;
        transform: translateX(-50%);
    }

    .labels {
        position: relative;
        margin-top: 1.25rem;
        min-height: 1.25rem;
    }

    .tick-label {
        position: absolute;
        font-size: 0.75rem;
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
</style>