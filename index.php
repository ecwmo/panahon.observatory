<?php
    // $modelInfo = json_decode(file_get_contents('resources/model/info.json'), true);
    // $modelInitTime = mktime($modelInfo["hour"], 0, 0, $modelInfo["month"], $modelInfo["day"], $modelInfo["year"]);
    // $modelInitStr = date("Y-m-d ga", $modelInitTime);
    // $modelPageHeader = "WRF Forecast Initialized at";
    // $modelPageHeader .= " " . $modelInitStr;
    // $modelPageHeader .= " PHT";
    $modelPageHeader = "Model Forecast Maps";
?>

<!doctype html>
<html lang="en">
<?php include_once('./components/head.php'); ?>

<body class="bg-gray-600 w-full md:w-4/5 mx-auto">
    <?php include_once('./components/header.php'); ?>
    <div class="bg-gray-300 border-l border-r border-b border-black flex flex-col-reverse md:flex-row py-4 justify-center"
        x-data="modelSelect()">
        <div class="flex flex-col">
            <div class="flex flex-col items-center space-y-4 px-6">
                <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Forecast Length</h3>
                <div class="flex flex-row text-sm">
                    <template x-for="(ft, i) in fcstTimes" :key="i">
                        <div class="flex text-gray-200 justify-center p-2"
                            :class="{'rounded-l-lg pl-3': i === 0, 'rounded-r-lg pr-3': i === 2, 'border-l border-r border-gray-200': (i > 0) && (i < 2), 'bg-blue-600': ft.val === fcstTime, 'cursor-pointer bg-gray-700 hover:bg-gray-500 hover:text-white': ft.val !== fcstTime}"
                            @click="setFcstTime(ft.val)" x-text="ft.text">
                        </div>
                    </template>
                </div>
            </div>
            <div class="flex flex-col items-center space-y-4 px-6">
                <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Fields</h3>
                <template x-for="mf in metFields" :key="mf.varName">
                    <div class="w-full sm:w-3/5 md:w-full flex justify-center text-gray-200 font-bold py-2 px-4 rounded-lg"
                        :class="{'bg-blue-600': mf.varName === varName, 'cursor-pointer bg-gray-700 hover:bg-gray-500 hover:text-white': mf.varName !== varName}"
                        @click="setVarName(mf.varName)" x-text="mf.text">
                    </div>
                </template>
            </div>
        </div>
        <div class="flex flex-col space-y-2 mx-12">
            <h2 class="text-center font-semibold text-3xl">
                <?php print $modelPageHeader; ?>
            </h2>
            <div class="flex flex-col justify-center px-4">
                <img class="object-center" :src="`resources/model/img/wrf-${fcstTime}hr_${varName}.png`" />
            </div>
        </div>
    </div>

    <!-- Main Script -->
    <script src="dist/main.js" type="text/javascript"></script>
</body>

</html>