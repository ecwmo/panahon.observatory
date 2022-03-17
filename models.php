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
      <!-- Forecast Length -->
      <div class="flex flex-col items-center space-y-2 px-6" x-show="isFcstTimeVisible">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Forecast Length</h3>
        <div class="flex flex-row text-xs">
          <template x-for="(ft, i) in fcstTimes" :key="i">
            <div class="flex text-gray-200 justify-center p-1"
              :class="{'rounded-l-lg pl-3': i === 0, 'rounded-r-lg pr-3': i === 4, 'border-l border-r border-gray-200': (i > 0) && (i < 4), 'bg-blue-600': ft.val === fcstTime, 'cursor-pointer bg-gray-700 hover:bg-gray-500 hover:text-white': ft.val !== fcstTime}"
              @click="setFcstTime(ft.val)" x-text="ft.text">
            </div>
          </template>
        </div>
      </div>
      <!-- Fields -->
      <div class="flex flex-col items-center space-y-2 px-6 min-w-max w-2/5 md:w-full mx-auto">
        <h3 class="text-center text-2xl font-semibold mt-4 mb-2">Fields</h3>
        <template x-for="mf in metFields" :key="mf.varName">
          <div class="w-full flex justify-center text-gray-200 font-bold py-2 px-4 rounded-lg"
            :class="{'bg-blue-600': mf.varName === varName, 'cursor-pointer bg-gray-700 hover:bg-gray-500 hover:text-white': mf.varName !== varName}"
            @click="setVarName(mf.varName)" x-text="mf.text">
          </div>
        </template>
      </div>
    </div>
    <div class="flex flex-col space-y-2 mx-12 md:w-full">
      <h2 class="text-center font-semibold text-4xl" , x-text="headerName"></h2>
      <div class="flex flex-col justify-center px-4">
        <img class="object-center shadow-md rounded-2xl" :src="`resources/model/img/${getImgName()}`" />
      </div>
      <div class="text-sm mx-5 font-semibold text-justify self-center break-words md:break-normal model-caption w-11/12"
        x-html="caption" x-show="caption"></div>
      <div
        class="italic text-sm mx-5 font-medium text-justify self-center break-words md:break-normal model-caption w-11/12">
        <span class="font-bold">DISCLAIMER</span>: This website contains experimental forecasts for research
        purposes. For official updates and
        warnings, please refer to PAGASA and other government agencies.
      </div>
    </div>
  </div>
</body>

</html>
