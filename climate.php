<!doctype html>
<html lang="en">
<?php include_once('./components/head.php'); ?>

<body class="bg-gray-600 w-full md:w-4/5 mx-auto">
    <?php include_once('./components/header.php'); ?>
    <div class="bg-gray-300 border-l border-r border-b border-black flex flex-col-reverse md:flex-row py-4 justify-center"
        x-data="climateSelect()">
        <div class="flex flex-col">
            <!-- Scenario -->
            <div class="flex flex-col items-center space-y-2 px-6">
                <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Scenario</h3>
                <div class="flex flex-row text-xs">
                    <template x-for="(s, i) in climateScenarios" :key="i">
                        <div class="flex text-gray-200 justify-center p-1"
                            :class="{'rounded-l-lg pl-3': i === 0, 'rounded-r-lg pr-3': i === (climateScenarios.length-1), 'border-l border-r border-gray-200': (i > 0) && (i < 4), 'bg-blue-600': s === activeScenario, 'cursor-pointer bg-gray-700 hover:bg-gray-500 hover:text-white': s !== activeScenario}"
                            @click="activeScenario = s" x-text="s">
                        </div>
                    </template>
                </div>
            </div>
            <!-- Variables -->
            <div class="flex flex-col items-center space-y-2 px-6 min-w-max w-2/5 md:w-full mx-auto">
                <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Variable</h3>
                <template x-for="climVar in climateVariables" :key="climVar.varName">
                    <div class="w-40 flex justify-center text-center text-gray-200 font-bold py-2 px-4 rounded-lg"
                        :class="{'bg-blue-600': climVar.varName === activeVariable, 'cursor-pointer bg-gray-700 hover:bg-gray-500 hover:text-white': climVar.varName !== activeVariable}"
                        @click="activeVariable = climVar.varName" x-text="climVar.desc">
                    </div>
                </template>
            </div>
        </div>
        <div class="flex flex-col items-center space-y-2 mx-12 md:w-full">
            <h2 class="text-center font-semibold text-4xl">Climate Anomaly</h2>
            <div class="flex flex-col w-1/2">
                <input type="range" name="decade" :min="minDecade" :max="maxDecade" step="10"
                    x-model.number="activeDecade">
                <div class="flex justify-between text-xs font-semibold -mt-0.5 mb-2 text-gray-600">
                    <template x-for="(d, i) in decades" :key="d[0]">
                        <span
                            :class="{'text-left -ml-2': i === 0, 'text-right -mr-2': i === (decades.length-1), 'text-center hidden md:block': (i > 0) && (i < (decades.length-1))}"
                            x-text="`${d[0]}`"></span>
                    </template>
                </div>
            </div>
            <div class="flex flex-col justify-center px-4">
                <img class="object-center shadow-md rounded-2xl" :src="imgName" />
            </div>
            <div
                class="italic text-sm mx-5 font-medium text-justify self-center break-words md:break-normal model-caption w-11/12">
                <span class="font-bold">DISCLAIMER</span>: This website contains experimental forecasts for research
                purposes. For official updates and
                warnings, please refer to PAGASA and other government agencies.
            </div>
        </div>
    </div>

    <!-- Main Script -->
    <script src="dist/main.js" type="text/javascript"></script>
</body>

</html>