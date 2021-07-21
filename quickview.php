<!doctype html>
<html lang="en">
<?php include_once('./components/head.php'); ?>

<body class="flex flex-col w-full md:w-max mx-auto bg-gray-600">
    <?php include_once('./components/header.php'); ?>
    <div class="bg-gray-300 border border-t-0 border-black flex flex-col justify-center" x-data="stationSelect()">
        <div class="flex flex-col md:flex-row bg-gray-400 border-b border-black text-xs p-3 gap-2 content-center">
            <!-- Map Switcher -->
            <div class="flex gap-1.5">
                <span class="hidden md:block">Map:</span>
                <label class="inline-flex items-center">
                    <input type="radio" name="mapSlct" class="h-3 w-3" @click="changeMap('ph')"><span
                        class="ml-1">Philippines</span>
                </label>
                <label class="inline-flex items-center">
                    <input type="radio" name="mapSlct" class="h-3 w-3" @click="changeMap('mm')" checked><span
                        class="ml-1">Metro
                        Manila</span>
                </label>
            </div>
            <!-- Station Dropdown -->
            <select x-model="activeStationId" x-effect="handleStationChange">
                <template x-for="(st, id) in activeLayer" :key="id">
                    <option :key="id" :value="id" x-text="st.address"></option>
                </template>
            </select>
        </div>
        <div class="flex flex-col-reverse md:flex-row md:justify-center gap-4 p-6">
            <div class="flex md:flex md:flex-col hidden m-auto md:mx-0">
                <div class="relative shadow-lg" style="width:400px;">
                    <!-- Map -->
                    <img :alt="mapAlt" :src="mapSrc" class="object-contain" />
                    <!-- Station Points -->
                    <div class="absolute left-0 top-0" id="ph-map">
                        <template x-for="(st, id) in activeLayer" :key="id">
                            <div class="absolute" :style="`top:${st.top}px;left:${st.left}px;`">
                                <div class="group border border-black rounded-full h-2 w-2 cursor-pointer" :key="id"
                                    @click="activeStationId = id">
                                    <div class="relative -mt-2 ml-1 w-36">
                                        <div
                                            class="absolute w-36 bottom-full right-1/2 px-3 py-2 z-10 opacity-0 bg-black text-white text-center text-xs rounded-lg group-hover:opacity-100 pointer-events-none">
                                            <span x-text="st.address"></span>
                                            <svg class="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px"
                                                viewBox="0 0 255 255" xml:space="preserve">
                                                <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="flex text-sm text-center shadow">
                <!-- Info Panel -->
                <div class="flex flex-col md:w-48">
                    <!-- Info Rain Panel -->
                    <div :class="activeVarPanel === 'rain' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
                        class="flex flex-col cursor-pointer py-3 px-2 border border-black" id="prain"
                        @click="setActiveVarPanel('rain')">
                        <div>
                            <p>Rainfall Rate (mm/hr)</p>
                            <h3 class="text-2xl md:text-3xl font-semibold" x-text="activeStationObs.rr">22.3</h3>
                        </div>
                        <div>
                            <p>Accumulated (mm/24hr)</p>
                            <h3 class="text-2xl md:text-3xl font-semibold" x-text="activeStationObs.rain24h">100</h3>
                        </div>
                    </div>
                    <!-- Info Temperature Panel -->
                    <div :class="activeVarPanel === 'temp' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
                        class="cursor-pointer py-3 px-2 border border-black border-t-0" id="ptemp"
                        @click="setActiveVarPanel('temp')">
                        <div>
                            <p>Temperature (&deg;C)</p>
                            <h3 class="text-2xl md:text-3xl font-semibold" x-text="activeStationObs.temp">33.7</h3>
                        </div>
                        <div>
                            <p>24hr Max (&deg;C): <span class="text-lg md:text-xl font-semibold"
                                    x-text="activeStationObs.tx">39.9</span></p>
                            <p>24hr Min (&deg;C): <span class="text-lg md:text-xl font-semibold"
                                    x-text="activeStationObs.tn">22.5</span></p>
                        </div>
                    </div>
                    <!-- Info Wind Panel -->
                    <div :class="activeVarPanel === 'wind' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
                        class="cursor-pointer py-3 px-2 border border-black border-t-0" id="pwind"
                        @click="setActiveVarPanel('wind')">
                        <div>
                            <p>Windspeed (m/s)</p>
                            <h3 class="text-2xl md:text-3xl font-semibold" x-text="activeStationObs.wspd">3.6</h3>
                        </div>
                        <div>
                            <p>Wind Direction (&deg;)</p>
                            <h3 class="text-2xl md:text-3xl font-semibold" x-text="activeStationObs.wdir">120</h3>
                        </div>
                    </div>
                    <!-- Info Pressure Panel -->
                    <div :class="activeVarPanel === 'pres' ? 'bg-blue-600 border-r-0' : 'bg-blue-300'"
                        class="cursor-pointer py-3 px-2 border border-black border-t-0" id="ppres"
                        @click="setActiveVarPanel('pres')">
                        <div>
                            <p>Air Pressure (mbar)</p>
                            <h3 class="text-2xl md:text-3xl font-semibold" x-text="activeStationObs.pres">1002.6</h3>
                        </div>
                    </div>
                </div>
                <!-- More Info Panel -->
                <div class="flex text-base md:text-lg w-52 lg:w-64">
                    <!-- More Info Rain Panel -->
                    <div x-show="activeVarPanel === 'rain'"
                        class="bg-blue-600 py-3 px-4 border border-black border-l-0 break-normal" id="pwriteup">
                        At <span class="font-semibold" x-text="activeStation.address"></span>, there was <span
                            class="font-semibold" x-text="`${(activeStationObs.rr * 10.)} mm`">0 mm</span>
                        rainfall
                        received at <span class="font-semibold" x-text="timeStr">12 nn</span>. There have been <span
                            class="font-semibold" x-text="`${activeStationObs.rain24h} mm`">0
                            mm</span>
                        accumulated
                        rainfall for the past 24 hours. This is <span class="font-semibold">{ratio}%</span> of the
                        historical
                        maximum
                        24hr rainfall for this
                        area which was <span class="font-semibold">{rain} mm</span>.
                    </div>
                    <!-- More Info Temperature Panel -->
                    <div x-show="activeVarPanel === 'temp'"
                        class="bg-blue-600 py-3 px-4 border border-black border-l-0 break-normal" id="pwriteup">
                        At <span class="font-semibold" x-text="activeStation.address"></span>, the temperature at <span
                            class="font-semibold" x-text="timeStr">12 nn</span> was
                        <span class="font-semibold" x-text="`${activeStationObs.temp} &deg;C`">32 &deg;C</span> but
                        feels like <span class="font-semibold" x-text="`${activeStationObs.hi} &deg;C`">58 &deg;C</span>
                        because of the
                        humidity. In the past 24 hours, local temperature got up to <span class="font-semibold"
                            x-text="`${activeStationObs.tx} &deg;C`">100 &deg;C</span> and
                        got
                        as low as <span class="font-semibold" x-text="`${activeStationObs.tn} &deg;C`">-10
                            &deg;C</span>.
                    </div>
                    <!-- More Info Wind Panel -->
                    <div x-show="activeVarPanel === 'wind'"
                        class="bg-blue-600 py-3 px-4 border border-black border-l-0 break-normal" id="pwriteup">
                        At <span class="font-semibold" x-text="activeStation.address"></span>, the wind at <span
                            class="font-semibold" x-text="timeStr">12 nn</span> was blowing
                        from <span class="font-semibold" x-text="`${activeStationObs.wdir}&deg;`">0&deg;</span> at <span
                            class="font-semibold" x-text="`${activeStationObs.wspd} m/s`">0 m/s</span>.
                    </div>
                    <!-- More Info Pressure Panel -->
                    <div x-show="activeVarPanel === 'pres'"
                        class="bg-blue-600 py-3 px-4 border border-black border-l-0 break-normal" id="pwriteup">
                        At <span class="font-semibold" x-text="activeStation.address"></span>, the air pressure was
                        <span class="font-semibold" x-text="`${activeStationObs.pres} mb`">0 mb</span>
                        at <span class="font-semibold" x-text="timeStr">12 nn</span>.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Script -->
    <script src="dist/main.js" type="text/javascript"></script>
</body>

</html>