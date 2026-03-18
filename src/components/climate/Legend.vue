<template>
    <div class="legend">
        <!-- Header -->
        <div v-if="hasAltStyle" class="legend__header">
            <label class="legend__header__range">Select Range:</label>
            <div class="legend__header__slider">
                <button :class="{ active: !usingAltStyle }" @click="$emit('changeLegend', false)">
                    All Years
                </button>
                <button :class="{ active: usingAltStyle }" @click="$emit('changeLegend', true)">
                    Displayed Map
                </button>
                <div class="legend__header__slider-bg" :class="{ right: usingAltStyle }"></div>
            </div>
            <span class="legend__header__info">
                &#9432;
                <span class="legend__header__tooltip">
                    All Years: min/max based on lowest/highest yearly average value<br />
                    Displayed Map: min/max based on lowest/highest selected period-scenario average
                </span>
            </span>
        </div>

        <!-- Title -->
        <div v-if="style.title" class="legend__title">{{ style.title }}</div>

        <!-- Gradient bar -->
        <div class="legend__gradient">
            <div class="legend__gradient__fill" :style="gradientStyle"></div>

            <div v-if="hoveredValue !== null && hoveredValue !== undefined && hoveredValue !== '' && !isNaN(hoveredValue)"
                 class="legend__gradient__marker"
                 :style="{ left: pointerPosition + '%' }">
                <span class="legend__gradient__marker-label">{{ hoveredValue }}{{ style.unit }}</span>
            </div>

            <div v-if="hoveredValue !== null && hoveredValue !== undefined && hoveredValue !== '' && !isNaN(hoveredValue)"
                 class="legend__gradient__line"
                 :style="{ left: pointerPosition + '%' }"></div>

            <div v-if="!discrete"
                 v-for="(entry, idx) in style.ramp"
                 :key="'tick-' + idx"
                 class="legend__gradient__tick"
                 :style="{ left: uniformTickPosition(idx) + '%' }"></div>
        </div>

        <!-- Threshold values -->
        <div class="legend__thresholds">
            <span v-for="(entry, idx) in style.ramp"
                :key="'threshold-' + idx"
                class="legend__thresholds__value"
                :class="{
                    'legend__thresholds__value--left': !discrete && idx === 0,
                    'legend__thresholds__value--right': !discrete && idx === style.ramp.length - 1
                }"
                :style="{ left: (discrete ? discreteCenterPosition(idx) : uniformTickPosition(idx)) + '%' }">
                {{ entry.threshold }}{{ style.unit }}
            </span>
        </div>

        <!-- Labels -->
        <div class="legend__labels">
            <span v-for="(entry, idx) in style.ramp"
                :key="'label-' + idx"
                class="legend__labels__text"
                :class="{
                    'legend__labels__text--left': !discrete && idx === 0,
                    'legend__labels__text--right': !discrete && idx === style.ramp.length - 1
                }"
                :style="{ left: (discrete ? discreteCenterPosition(idx) : uniformTickPosition(idx)) + '%' }">
                {{ entry.label }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent } from "vue";
    import chroma from "chroma-js";

    interface RampEntry {
        threshold: number;
        color: string;
        label?: string;
    }

    interface LegendStyle {
        title?: string;
        unit: string;
        ramp: RampEntry[];
    }

    export default defineComponent({
        name: "Legend",
        props: {
            style: {
                type: Object as () => LegendStyle,
                required: true
            },
            hoveredValue: { type: Number, default: null },
            hasAltStyle: { type: Boolean, default: false },
            usingAltStyle: { type: Boolean, default: false },
            discrete: { type: Boolean, default: false }
        },
        setup(props, { emit }) {
            const gradientStyle = computed(() => {
                const ramp = props.style.ramp;
                const colors = ramp.map(r => r.color);
                const n = ramp.length;

                if (props.discrete) {
                    const stops = [];
                    for (let i = 0; i < n; i++) {
                        const pctStart = (i / n) * 100;
                        const pctEnd = ((i + 1) / n) * 100;
                        stops.push(`${colors[i]} ${pctStart}%`, `${colors[i]} ${pctEnd}%`);
                    }
                    return { background: `linear-gradient(to right, ${stops.join(", ")})` };
                }
                else {
                    const scale = chroma.scale(colors).mode("lab");
                    const steps = 100;
                    const stops = [];
                    for (let i = 0; i <= steps; i++) {
                        const t = i / steps;
                        stops.push(`${scale(t).hex()} ${t * 100}%`);
                    }
                    return { background: `linear-gradient(to right, ${stops.join(", ")})` };
                }
            });

            const pointerPosition = computed(() => {
                if (props.hoveredValue == null) return 0;
                const thresholds = props.style.ramp.map(r => Number(r.threshold));
                const n = thresholds.length;
                const hv = Number(props.hoveredValue);

                if (!props.discrete) {
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
                    if (hv === thresholds[i]) return ((i + 0.5) / n) * 100;
                }

                for (let i = 0; i < n - 1; i++) {
                    if (thresholds[i] === thresholds[i + 1] && hv === thresholds[i]) {
                        return ((i + 0.5) / n) * 100;
                    }
                }
                return 0;
            });

            const uniformTickPosition = (idx) => {
                const n = props.style.ramp.length;
                return (idx / (n - 1)) * 100;
            };

            const discreteCenterPosition = (idx) => {
                const n = props.style.ramp.length;
                return ((idx + 0.5) / n) * 100;
            };

            return {
                gradientStyle,
                pointerPosition,
                uniformTickPosition,
                discreteCenterPosition
            };
        }
    });
</script>

<style scoped>
/* ================= FULL OBJECT ================= */
    .legend {
        font-family: sans-serif;
        background: #f8f9fa;
        border: 1px solid #ccc;
        padding: 0.5rem;
        width: 100%;
        max-width: 600px;
        position: relative;
    }

/* ================= TITLE ================= */
    .legend__title {
        font-size: 1.0rem;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

/* ================= HEADER ================= */
    .legend__header {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        gap: 0.5rem;
    }

    .legend__header__range {
        font-size: 0.8rem;
        margin: 0;
        color: #333;
    }

    .legend__header__slider {
        position: relative;
        display: inline-flex;
        background: #ddd;
        border-radius: 20px;
        overflow: hidden;
        width: 200px;
    }

    .legend__header__slider button {
        flex: 1;
        padding: 4px 0;
        border: none;
        background: transparent;
        font-size: 0.75rem;
        color: #333;
        cursor: pointer;
        z-index: 1;
    }

    .legend__header__slider button.active {
        color: #fff;
    }

    .legend__header__slider-bg {
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

    .legend__header__slider-bg.right {
        transform: translateX(100%);
    }

    .legend__header__info {
        position: relative;
        cursor: pointer;
        font-family: "Segoe UI Symbol", "Noto Sans Symbols", sans-serif;
        font-size: 22px;
        color: #333;
        padding-bottom: 3px;
    }

    .legend__header__tooltip {
        position: absolute;
        top: 50%;
        left: 100%;
        margin-left: 8px;
        transform: translateY(-50%);
        background: #5A6C7D;
        color: #fff;
        padding: 6px 8px;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.2s;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 2;
        max-width: 500px;
        pointer-events: none;
    }

    @media (max-width: 720px) {
        .legend__header__tooltip {
            white-space: normal;
            width: 250px;
        }
    }

    .legend__header__info:hover .legend__header__tooltip {
        opacity: 1;
    }

/* ================= GRADIENT BAR ================= */
    .legend__gradient {
        position: relative;
        height: 24px;
        border: 1px solid #999;
    }

    .legend__gradient__fill {
        height: 100%;
        width: 100%;
    }

    .legend__gradient__marker {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }

    .legend__gradient__marker-label {
        font-size: 0.8rem;
        background: #fff;
        padding: 0 3px;
        border: 1px solid #ccc;
        border-radius: 2px;
        white-space: nowrap;
    }

    .legend__gradient__line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        background: red;
        transform: translateX(-50%);
        z-index: 999;
    }

    .legend__gradient__tick {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        background: #000;
        transform: translateX(-50%);
    }

/* ================= THRESHOLD VALUES ================= */
    .legend__thresholds {
        position: relative;
        margin-top: 0.25rem;
        min-height: 1rem;
    }

    .legend__thresholds__value {
        position: absolute;
        font-size: 0.8rem;
        transform: translateX(-50%);
        white-space: nowrap;
        text-align: center;
        line-height: 1;
    }

    .legend__thresholds__value--left {
        transform: translateX(0);
    }

    .legend__thresholds__value--right {
        transform: translateX(-100%);
    }

/* ================= LABELS ================= */
    .legend__labels {
        position: relative;
        margin-top: 0.25rem;
        min-height: 1rem;
    }

    .legend__labels__text {
        position: absolute;
        font-size: 0.8rem;
        transform: translateX(-50%);
        white-space: nowrap;
        text-align: center;
        line-height: 1;
    }

    .legend__labels__text--left {
        transform: translateX(0);
    }

    .legend__labels__text--right {
        transform: translateX(-100%);
    }

/* ================= GLOBAL ================= */
    * {
        color: black;
    }
</style>