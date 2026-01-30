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
                <select v-model="locationName">
                    <option v-show="!locationName" :value="null">Select Province</option>
                    <option v-for="prov in provinces" :key="prov.name" :value="prov.name">
                        {{ prov.name }}
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
                    <option>Historical: 1981 - 2015</option>
                    <option>Mid Future: 2030 - 2055</option>
                    <option>Far Future: 2056 - 2080</option>
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
                    <option v-for="opt in availableScenarios" :key="opt" :value="opt">
                        {{ opt }}
                    </option>
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
                locationName: null,
                provinces: [],
                pastData: "Temperature Anomaly",
                projectedData: "Temperature Anomaly",
                pastPeriod: "",
                projectedPeriod: "Historical: 1981 - 2015",
                scenario: "Historical",
                months: [],
                suppressEmit: false
            };
        },
        computed: {
            availableScenarios() {
                if (this.projectedPeriod === 'Historical: 1981 - 2015') {
                    return ['Historical'];
                } else {
                    return ['SSP1 - 2.6', 'SSP2 - 4.5', 'SSP5 - 8.5'];
                }
            }
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
            emitSelection(source) {
                const selectedProv = this.provinces.find(p => p.name === this.locationName) || null;
                this.$emit("selection-changed", {
                    tab: this.tab,
                    location: selectedProv,
                    pastData: this.pastData,
                    projectedData: this.projectedData,
                    pastPeriod: this.pastPeriod,
                    projectedPeriod: this.projectedPeriod,
                    scenario: this.scenario,
                    source
                });
            }
        },
        watch: {
            externalLocation(newLoc) {
                if (newLoc && newLoc.name) {
                    this.suppressEmit = true;
                    this.locationName = newLoc.name;
                    this.emitSelection("external");
                    this.$nextTick(() => { this.suppressEmit = false; });
                } else {
                    this.suppressEmit = true;
                    this.locationName = null;
                    this.emitSelection("external");
                    this.$nextTick(() => { this.suppressEmit = false; });
                }
            },
            locationName(newVal, oldVal) {
                if (newVal !== oldVal && !this.suppressEmit) {
                    this.emitSelection("manual");
                }
            },
            tab() {
                this.emitSelection("manual");
            },
            pastData() {
                this.emitSelection("manual");
            },
            projectedData() {
                this.emitSelection("manual");
            },
            pastPeriod() {
                this.emitSelection("manual");
            },
            scenario() {
                this.emitSelection("manual");
            },
            projectedPeriod(newPeriod) {
                var scenarioChange = false;
                if (newPeriod === 'Historical: 1981 - 2015') {
                    this.scenario = 'Historical';
                    scenarioChange = true;
                }
                else if (!['SSP1 - 2.6', 'SSP2 - 4.5', 'SSP5 - 8.5'].includes(this.scenario)) {
                    this.scenario = 'SSP1 - 2.6';
                    scenarioChange = true;
                }

                if (!scenarioChange) {
                    this.emitSelection("manual");
                }
            }
        },
        mounted() {
            this.emitSelection("manual");
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