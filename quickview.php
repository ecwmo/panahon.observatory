<!doctype html>
<html lang="en">
<?php include_once('./components/head.php'); ?>

<body class="bg-gray-600 w-full md:w-4/5 mx-auto">
  <?php include_once('./components/header.php'); ?>
  <div class="bg-gray-300 border-l border-r border-b border-black flex flex-col justify-center"
    x-data="stationSelect()">
    <div class="flex bg-gray-400 border border-black text-xs">
      <div class="px-2 py-3">
        <form>
          Map: <input checked="checked" id="phradio" name="map" @click="changeMap('ph')"
            type="radio">Philippines</input>
          <input id="mmradio" name="map" @click="changeMap('mm')" type="radio">Metro Manila</input>
          <!-- Station: <span id="st-choice" onmousedown="stcollapse()">Ateneo de Manila University, Quezon City</span> -->
        </form>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="flex flex-col justify-center">
        <div class="relative border border-black object-none">
          <img x-bind:alt="mapAlt" x-bind:src="mapSrc" />
          <div class="absolute left-0 top-0" id="ph-map">
            <template x-for="(st, i) in stationPts" :key="i">
              <div class="absolute border border-black rounded-full h-2 w-2 cursor-pointer"
                x-bind:style="`top:${st.top}px;left:${st.left}px;`"></div>
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
      <div class="flex w-1/2 my-4 p-3 text-sm text-center">
        <div class="flex flex-col flex-grow">
          <div :class="activeVarPanel === 'rain' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
            class="flex flex-col cursor-pointer py-3 border border-black" id="prain" @click="setActiveVarPanel('rain')">
            <div>
              <p>Rainfall Rate (mm/hr)</p>
              <h3 class="text-3xl font-semibold">22.3</h3>
            </div>
            <div>
              <p>Accumulated (mm/24hr)</p>
              <h3 class="text-3xl font-semibold">100</h3>
            </div>
          </div>
          <div :class="activeVarPanel === 'temp' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
            class="cursor-pointer py-3 px-2 border border-black border-t-0" id="ptemp"
            @click="setActiveVarPanel('temp')">
            <div>
              <p>Temperature (&deg;C)</p>
              <h3 class="text-3xl font-semibold">33.7</h3>
            </div>
            <div>
              <p>24hr Max (&deg;C): <span class="tmpval">39.9</span></p>
              <p>24hr Min (&deg;C): <span class="tmpval">22.5</span></p>
            </div>
          </div>
          <div :class="activeVarPanel === 'wind' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
            class="cursor-pointer py-3 px-2 border border-black border-t-0" id="pwind"
            @click="setActiveVarPanel('wind')">
            <div>
              <p>Windspeed (m/s)</p>
              <h3 class="text-3xl font-semibold">3.6</h3>
            </div>
            <div>
              <p>Wind Direction (&deg;)</p>
              <h3 class="text-3xl font-semibold">120</h3>
            </div>
          </div>
          <div :class="activeVarPanel === 'pres' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
            class="cursor-pointer py-3 px-2 border border-black border-t-0" id="ppres"
            @click="setActiveVarPanel('pres')">
            <div>
              <p>Air Pressure (mbar)</p>
              <h3 class="text-3xl font-semibold">1002.6</h3>
            </div>
          </div>
        </div>
        <div class="flex w-1/2 text-lg">
          <div x-show="activeVarPanel === 'rain'"
            class="bg-blue-600 py-3 px-2 border border-black border-l-0 break-normal" id="pwriteup">
            At <span class="highlight">{station}</span>, there was <span class="highlight">{rain} mm</span>
            rainfall
            received at <span class="highlight">{time}</span>. There have been <span class="highlight">{rain accum}
              mm</span>
            accumulated
            rainfall for the past 24 hours. This is <span class="highlight">{ratio}%</span> of the historical maximum
            24hr rainfall for this
            area which was <span class="highlight">{rain} mm</span>.
          </div>
          <div x-show="activeVarPanel === 'temp'"
            class="bg-blue-600 py-3 px-2 border border-black border-l-0 break-normal" id="pwriteup">
            At <span class="highlight">{station}</span>, the temperature at <span class="highlight">{time}</span> was
            <span class="highlight">{temp} &deg;C</span> but feels like <span class="highlight">{hi} &deg;C</span>
            because of the
            humidity. In the past 24 hours, local temperature got up to <span class="highlight">{tx} &deg;C</span> and
            got
            as low as <span class="highlight">{tn} &deg;C</span>.
          </div>
          <div x-show="activeVarPanel === 'wind'"
            class="bg-blue-600 py-3 px-2 border border-black border-l-0 break-normal" id="pwriteup">
            At <span class="highlight">{station}</span>, the wind at <span class="highlight">{time}</span> was blowing
            from <span class="highlight">{wdir} &deg;</span> at <span class="highlight">{wspd}</span> m/s.
          </div>
          <div x-show="activeVarPanel === 'pres'"
            class="bg-blue-600 py-3 px-2 border border-black border-l-0 break-normal" id="pwriteup">
            At <span class="highlight">{station}</span>, the air pressure was <span class="highlight">{pres} mb</span>
            at <span class="highlight">{time}</span>.
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