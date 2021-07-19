<!doctype html>
<html lang="en">
<?php include_once('./components/head.php'); ?>

<body class="bg-gray-600 w-full md:w-4/5 mx-auto">
  <?php include_once('./components/header.php'); ?>
  <div class="bg-gray-300 border border-t-0 border-black flex flex-col justify-center"
    x-data="stationSelect()">
    <div class="flex bg-gray-400 border-b border-black text-xs p-3 space-x-4">
      <div class="flex space-x-2">
        <span>Map:</span> 
        <label class="inline-flex items-center">
          <input type="radio" name="mapSlct" class="h-3 w-3" @click="changeMap('ph')"><span class="ml-1">Philippines</span>
        </label>
        <label class="inline-flex items-center">
          <input type="radio" name="mapSlct" class="h-3 w-3" @click="changeMap('mm')" checked><span class="ml-1">Metro Manila</span>
        </label>
      </div>
      <select 
        x-model="activeStationId"
        x-effect="handleStationChange">
        <template x-for="(st, id) in activeLayer" :key="id">
            <option :key="id" :value="id" x-text="st.address"></option>
        </template>
      </select>
    </div>
    <div class="flex flex-col-reverse md:flex-row md:justify-center gap-4 p-6">
      <div class="flex flex-col m-auto md:mx-0">
        <div class="relative shadow-lg" style="width:400px;">
          <img :alt="mapAlt" :src="mapSrc" class="object-contain" />
          <div class="absolute left-0 top-0" id="ph-map">
            <template x-for="(st, id) in activeLayer" :key="id">
              <div 
                class="absolute"
                :style="`top:${st.top}px;left:${st.left}px;`">
                <div class="group border border-black rounded-full h-2 w-2 cursor-pointer"
                  :key="id"
                  @click="activeStationId = id">
                  <div class="relative -mt-2 ml-1 w-36">
                    <div 
                      class="absolute w-36 bottom-full right-1/2 px-3 py-2 z-10 opacity-0 bg-black text-white text-center text-xs rounded-lg group-hover:opacity-100 pointer-events-none"
                      >
                      <span x-text="st.address"></span>
                      <svg class="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- <div id="colorbar"></div>
        <div class="hidden" id="rainbar">
          <table>
            <tr>
              <td id="rn0">0</td>
              <td id="rn1">5</td>
              <td id="rn2">10</td>
              <td id="rn3">15</td>
              <td id="rn4">20</td>
              <td id="rn5">25</td>
              <td id="rn6">30</td>
              <td id="rn7">35</td>
              <td id="rn8">40</td>
              <td id="rn9">45</td>
              <td id="rn10">&gt;50</td>
            </tr>
          </table>
        </div>
        <div class="hidden" id="rainaccbar">
          <table>
            <tr>
              <td id="rn0">0</td>
              <td id="rn1">10</td>
              <td id="rn2">20</td>
              <td id="rn3">30</td>
              <td id="rn4">40</td>
              <td id="rn5">50</td>
              <td id="rn6">60</td>
              <td id="rn7">70</td>
              <td id="rn8">80</td>
              <td id="rn9">90</td>
              <td id="rn10">&gt;100</td>
            </tr>
          </table>
        </div>
        <div class="hidden" id="tempbar">
          <table>
            <tr>
              <td id="tp0">16</td>
              <td id="tp1">18</td>
              <td id="tp2">20</td>
              <td id="tp3">22</td>
              <td id="tp4">24</td>
              <td id="tp5">26</td>
              <td id="tp6">28</td>
              <td id="tp7">30</td>
              <td id="tp8">32</td>
              <td id="tp9">34</td>
              <td id="tp10">36</td>
            </tr>
          </table>
        </div> -->
      </div>
      <!-- <div id="st-tooltip"></div> -->
      <div class="flex text-sm text-center shadow" style="width:600px;">
        <div class="flex flex-col flex-grow">
          <div :class="activeVarPanel === 'rain' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
            class="flex flex-col cursor-pointer py-3 border border-black" id="prain" @click="setActiveVarPanel('rain')">
            <div>
              <p>Rainfall Rate (mm/hr)</p>
              <h3 class="text-3xl font-semibold" x-text="activeStationObs.rr">22.3</h3>
            </div>
            <div>
              <p>Accumulated (mm/24hr)</p>
              <h3 class="text-3xl font-semibold" x-text="activeStationObs.rain24h">100</h3>
            </div>
          </div>
          <div :class="activeVarPanel === 'temp' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
            class="cursor-pointer py-3 px-2 border border-black border-t-0" id="ptemp"
            @click="setActiveVarPanel('temp')">
            <div>
              <p>Temperature (&deg;C)</p>
              <h3 class="text-3xl font-semibold" x-text="activeStationObs.temp">33.7</h3>
            </div>
            <div>
              <p>24hr Max (&deg;C): <span class="text-xl font-semibold" x-text="activeStationObs.tx">39.9</span></p>
              <p>24hr Min (&deg;C): <span class="text-xl font-semibold" x-text="activeStationObs.tn">22.5</span></p>
            </div>
          </div>
          <div :class="activeVarPanel === 'wind' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
            class="cursor-pointer py-3 px-2 border border-black border-t-0" id="pwind"
            @click="setActiveVarPanel('wind')">
            <div>
              <p>Windspeed (m/s)</p>
              <h3 class="text-3xl font-semibold" x-text="activeStationObs.wspd">3.6</h3>
            </div>
            <div>
              <p>Wind Direction (&deg;)</p>
              <h3 class="text-3xl font-semibold" x-text="activeStationObs.wdir">120</h3>
            </div>
          </div>
          <div :class="activeVarPanel === 'pres' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
            class="cursor-pointer py-3 px-2 border border-black border-t-0" id="ppres"
            @click="setActiveVarPanel('pres')">
            <div>
              <p>Air Pressure (mbar)</p>
              <h3 class="text-3xl font-semibold" x-text="activeStationObs.pres">1002.6</h3>
            </div>
          </div>
        </div>
        <div class="flex text-lg w-1/2">
          <div x-show="activeVarPanel === 'rain'"
            class="bg-blue-600 py-3 px-2 border border-black border-l-0 break-normal" id="pwriteup">
            At <span class="font-semibold" x-text="activeStation.address"></span>, there was <span class="font-semibold" x-text="`${(activeStationObs.rr * 10.)} mm`">0 mm</span>
            rainfall
            received at <span class="font-semibold" x-text="timeStr">12 nn</span>. There have been <span class="font-semibold" x-text="`${activeStationObs.rain24h} mm`">0
              mm</span>
            accumulated
            rainfall for the past 24 hours. This is <span class="font-semibold">{ratio}%</span> of the historical maximum
            24hr rainfall for this
            area which was <span class="font-semibold">{rain} mm</span>.
          </div>
          <div x-show="activeVarPanel === 'temp'"
            class="bg-blue-600 py-3 px-2 border border-black border-l-0 break-normal" id="pwriteup">
            At <span class="font-semibold" x-text="activeStation.address"></span>, the temperature at <span class="font-semibold" x-text="timeStr">12 nn</span> was
            <span class="font-semibold" x-text="`${activeStationObs.temp} &deg;C`">32 &deg;C</span> but feels like <span class="font-semibold" x-text="`${activeStationObs.hi} &deg;C`">58 &deg;C</span>
            because of the
            humidity. In the past 24 hours, local temperature got up to <span class="font-semibold" x-text="`${activeStationObs.tx} &deg;C`">100 &deg;C</span> and
            got
            as low as <span class="font-semibold" x-text="`${activeStationObs.tn} &deg;C`">-10 &deg;C</span>.
          </div>
          <div x-show="activeVarPanel === 'wind'"
            class="bg-blue-600 py-3 px-2 border border-black border-l-0 break-normal" id="pwriteup">
            At <span class="font-semibold" x-text="activeStation.address"></span>, the wind at <span class="font-semibold" x-text="timeStr">12 nn</span> was blowing
            from <span class="font-semibold" x-text="`${activeStationObs.wdir}&deg;`">0&deg;</span> at <span class="font-semibold" x-text="`${activeStationObs.wspd} m/s`">0 m/s</span>.
          </div>
          <div x-show="activeVarPanel === 'pres'"
            class="bg-blue-600 py-3 px-2 border border-black border-l-0 break-normal" id="pwriteup">
            At <span class="font-semibold" x-text="activeStation.address"></span>, the air pressure was <span class="font-semibold" x-text="`${activeStationObs.pres} mb`">0 mb</span>
            at <span class="font-semibold" x-text="timeStr">12 nn</span>.
          </div>
        </div>
      </div>

      <!-- <div class="left mapnavi">
        <input checked="checked" name="parameter" onmouseup="mapparam('rain')" type="radio"> Rainfall Rate</br>
        <input name="parameter" onmouseup="mapparam('racc')" type="radio"> Accumulated Rainfall (24hrs)</br>
        <input name="parameter" onmouseup="mapparam('tmp')" type="radio"> Temperature</br></br>
      </div> -->
    </div>
  </div>

  <!-- Main Script -->
  <script src="dist/main.js" type="text/javascript"></script>
</body>

</html>