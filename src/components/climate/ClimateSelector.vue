<template>
    <div class="selector-panel">
        <!-- Tabs -->
        <div class="tabs">
            <button :class="{ active: tab === 'Current' }" @click="tab = 'Current'">Current</button>
            <button :class="{ active: tab === 'Projected' }" @click="tab = 'Projected'">Projected</button>
        </div>

        <!-- Controls -->
        <div class="controls">
            <!-- Location -->
            <div class="section">
                <h4>Location</h4>
                <select v-model="location">
                    <option v-show="!location" :value="null">Select Province</option>
                    <option v-for="prov in provinces" :key="prov.ADM2_EN" :value="prov">
                        {{ prov.ADM2_EN }}
                    </option>
                </select>
            </div>

            <!-- Data -->
            <div class="section" v-if="tab === 'Current'">
                <h4>Data</h4>
                <select v-model="pastData">
                    <option>Temperature Anomaly</option>
                    <option>Rain Anomaly</option>
                </select>
            </div>
            <div class="section" v-if="tab === 'Projected'">
                <h4>Data</h4>
                <select v-model="projectedData">
                    <option>Temperature Anomaly</option>
                    <option>Rain Anomaly</option>
                </select>
            </div>

            <!-- Period -->
            <div class="section" v-if="tab === 'Projected'">
                <h4>Period</h4>
                <select v-model="projectedPeriod">
                    <option>2001 - 2050</option>
                    <option>2051 - 2100</option>
                </select>
            </div>
            <div class="section" v-if="tab === 'Current'">
                <h4>Period</h4>
                <select v-model="pastPeriod">
                    <option v-for="month in months" :key="month" :value="month">
                        {{ month }}
                    </option>
                </select>
            </div>

            <!-- Scenario -->
            <div class="section" v-if="tab === 'Projected'">
                <h4>Scenario</h4>
                <select v-model="scenario">
                    <option>SSP1 - 2.6</option>
                    <option>SSP2 - 4.5</option>
                    <option>SSP5 - 8.5</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ClimateSelector",
        props: {
            externalLocation: { type: Object, default: null }
        },
        data() {
            return {
                tab: "Current",
                location: null,
                pastData: "Temperature Anomaly",
                projectedData: "Temperature Anomaly",
                pastPeriod: "",
                projectedPeriod: "2001 - 2050",
                scenario: "SSP5 - 8.5",
                months: [],
                provinces: [],
                suppressEmit: false
            };
        },
        created() {
            const start = new Date(2022, 11);
            const end = new Date(2025, 11);
            const options = [];
            let current = new Date(start);
            while (current <= end) {
                const monthName = current.toLocaleString("default", { month: "long" });
                const year = current.getFullYear();
                options.push(`${monthName} ${year}`);
                current.setMonth(current.getMonth() + 1);
            }
            this.months = options;
            this.pastPeriod = this.months[this.months.length - 1];
            fetch("/api/climate/provinces")
                .then(res => res.json())
                .then(data => {
                    this.provinces = data;
                })
                .catch(err => console.error("Error fetching provinces:", err));
        },
        methods: {
            emitSelection() {
                this.$emit("selection-changed", {
                    tab: this.tab,
                    location: this.location,
                    pastData: this.pastData,
                    projectedData: this.projectedData,
                    pastPeriod: this.pastPeriod,
                    projectedPeriod: this.projectedPeriod,
                    scenario: this.scenario
                });
            }
        },
        watch: {
            externalLocation(newLoc) {
                if (newLoc && newLoc.ADM2_EN) {
                    const match = this.provinces.find(p => p.ADM2_EN === newLoc.ADM2_EN);
                    if (match && (!this.location || this.location.ADM2_EN !== match.ADM2_EN)) {
                        this.suppressEmit = true;
                        this.location = match;
                    }
                } else {
                    // blank externalLocation -> clear selection
                    this.suppressEmit = true;
                    this.location = null;
                }
            },
            location(newVal, oldVal) {
                if (this.suppressEmit) {
                    this.suppressEmit = false;
                    return;
                }
                if (!oldVal || !newVal || newVal.ADM2_EN !== oldVal.ADM2_EN) {
                    this.emitSelection();
                }
                if (!newVal && oldVal)
                {
                    this.emitSelection();
                }
            },
            tab: "emitSelection",
            pastData: "emitSelection",
            projectedData: "emitSelection",
            pastPeriod: "emitSelection",
            projectedPeriod: "emitSelection",
            scenario: "emitSelection"
        },
        mounted() {
            this.emitSelection();
        }
    };
</script>

<style scoped>
    .selector-panel {
        padding: 1rem;
        background: #eef2f7;
        border-right: 1px solid #ccc;
        height: 100%;
        overflow-y: auto;
        font-family: sans-serif;
    }

    .tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .tabs button {
        flex: 1;
        padding: 0.6rem 1rem;
        border: none;
        background: #ddd;
        cursor: pointer;
        font-weight: bold;
        border-radius: 4px;
    }

    .tabs button.active {
        background: #4dabf7;
        color: white;
    }

    .controls {
        margin-top: 1rem;
    }

    .section {
        margin-bottom: 1.5rem;
    }

    .section h4 {
        margin: 0 0 0.5rem;
        font-size: 0.95rem;
        color: #333;
    }

    select {
        width: 100%;
        padding: 0.4rem;
        font-size: 0.9rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        color: black;
    }
</style>