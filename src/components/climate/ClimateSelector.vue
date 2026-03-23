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
                    <option v-for="opt in currentDataOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
            </div>
            <div class="section" v-if="tab === 'Projected'">
                <h4>Data</h4>
                <select v-model="projectedData">
                    <option v-for="opt in projectedDataOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
            </div>

            <!-- Period -->
            <div class="section" v-if="tab === 'Projected'">
                <h4>Period</h4>
                <select v-model="projectedPeriod">
                    <option v-for="opt in projectedPeriodOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
            </div>
            <div class="section" v-if="tab === 'Current'">
                <h4>Period</h4>
                <select v-model="pastPeriod">
                    <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                </select>
            </div>

            <!-- Scenario -->
            <div class="section" v-if="tab === 'Projected'">
                <h4>Scenario</h4>
                <select v-model="scenario">
                    <option v-for="opt in availableScenarios" :key="opt" :value="opt">{{ opt }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch, nextTick, onMounted } from 'vue';

    // --- Props ---
    const props = defineProps<{
        externalLocation?: { name?: string } | null;
        mapReady?: boolean;
    }>();

    // --- Shared state ---
    const tab = ref <'Current' | 'Projected'>('Current');
    const locationName = ref<string | null>(null);
    const provinces = ref< { name: string; lat: number; lon: number }[]>([]);
    const suppressEmit = ref(false);
    const initialized = ref(false);

    // --- Current parameters ---
    const currentDataOptions = ['Temperature', 'Temperature Anomaly', 'Rain', 'Rain Anomaly'];
    const pastData = ref(currentDataOptions[0]);
    const months = ref <string[]>([]);
    const pastPeriod = ref('');

    // --- Projected parameters ---
    const projectedDataOptions = ['Temperature Anomaly', 'Rain Anomaly'];
    const projectedPeriodOptions = [
        'Historical: 1995 - 2014',
        '2015 - 2034',
        '2035 - 2054',
        '2055 - 2074',
        '2075 - 2094'
    ];
    const scenarioOptions = ['Historical', 'SSP1 - 2.6', 'SSP2 - 4.5', 'SSP5 - 8.5'];

    const projectedData = ref(projectedDataOptions[0]);
    const projectedPeriod = ref(projectedPeriodOptions[0]);
    const scenario = ref(scenarioOptions[0]);

    // --- Computed ---
    const availableScenarios = computed(() =>
        projectedPeriod.value === 'Historical: 1995 - 2014'
            ? ['Historical']
            : scenarioOptions.filter(s => s !== 'Historical')
    );

    // --- Emit ---
    const emit = defineEmits<{(e: 'selection-changed', payload:
        | {
            tab: 'Current';
            location: { name: string; lat: number; lon: number } | null;
            pastData: string;
            pastPeriod: string;
            source: 'manual' | 'external';
        }
        | {
            tab: 'Projected';
            location: { name: string; lat: number; lon: number } | null;
            projectedData: string;
            projectedPeriod: string;
            scenario: string;
            source: 'manual' | 'external';
        }): void;
    }>();

    function emitSelection(source: 'manual' | 'external'): void {
        if (!initialized.value) return;
        const selectedProv = provinces.value.find(p => p.name === locationName.value) || null;
        if (tab.value === 'Current') {
            emit('selection-changed', {
                tab: 'Current',
                location: selectedProv,
                pastData: pastData.value,
                pastPeriod: pastPeriod.value,
                source
            });
        }
        else {
            emit('selection-changed', {
                tab: 'Projected',
                location: selectedProv,
                projectedData: projectedData.value,
                projectedPeriod: projectedPeriod.value,
                scenario: scenario.value,
                source
            });
        }
    }

    // --- Setup helpers ---
    async function setupMonths(): Promise<void> {
        const res = await fetch('/api/climate/months');
        const data = await res.json();
        if (data.success) {
            const start = new Date(data.start);
            const end = new Date(data.end);
            const options: string[] = [];
            let current = new Date(start);
            while (current <= end) {
                const monthName = current.toLocaleString('default', { month: 'short' });
                const year = current.getFullYear();
                options.push(`${monthName} ${year}`);
                current.setMonth(current.getMonth() + 1);
            }
            months.value = options;
            pastPeriod.value = months.value[months.value.length - 1];
        }
    }

    async function setupProvinces(): Promise<void> {
        const res = await fetch('/api/climate/provinces');
        provinces.value = await res.json();
    }

    // --- Watchers ---
    watch(() => props.mapReady, () => emitSelection('manual'));

    watch(() => props.externalLocation, newLoc => {
        suppressEmit.value = true;
        locationName.value = newLoc?.name ?? null;
        emitSelection('external');
        nextTick(() => { suppressEmit.value = false; });
    });

    watch(locationName, (newVal, oldVal) => {
        if (newVal !== oldVal && !suppressEmit.value) {
            emitSelection('manual');
        }
    });

    watch([tab, pastData, projectedData, pastPeriod, scenario], () => {
        if (!suppressEmit.value) emitSelection('manual');
    });

    watch(projectedPeriod, newPeriod => {
        let scenarioChange = false;
        if (newPeriod === 'Historical: 1995 - 2014') {
            scenario.value = 'Historical';
            scenarioChange = true;
        }
        else if (!['SSP1 - 2.6', 'SSP2 - 4.5', 'SSP5 - 8.5'].includes(scenario.value)) {
            scenario.value = 'SSP1 - 2.6';
            scenarioChange = true;
        }
        if (!scenarioChange) {
            emitSelection('manual');
        }
    });

    // --- Lifecycle ---
    onMounted(async () => {
        await setupMonths();
        await setupProvinces();
        initialized.value = true;
        emitSelection('manual');
    });
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

    option {
        text-align: left;
        font-family: monospace;
    }
</style>