<!doctype html>
<html lang="en">
<?php include_once('./components/head.php'); ?>

<body class="flex flex-col md:w-max mx-auto bg-gray-600">
    <?php include_once('./components/header.php'); ?>
    <div class="bg-gray-300 border border-t-0 border-black flex flex-col items-center" x-data="stationSelect()">
        <div
            class="w-full flex flex-col md:flex-row bg-gray-400 border-b border-black text-xs p-3 gap-2 content-center">
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
            <div class="flex text-sm text-center items-center">
                <!-- Info Panel -->
                <div class="flex flex-col" :class="showMoreInfo ? '' : 'gap-2 md:gap-4'">
                    <div class="flex" :class="showMoreInfo ? 'flex-col' : 'flex-col gap-2 md:flex-row md:gap-4'">
                        <!-- Info Rain Panel -->
                        <div :class="activeVarPanel === 'rain' ? 'bg-blue-600 text-gray-900' : 'bg-blue-300 text-gray-800'"
                            class="relative flex flex-col cursor-pointer py-3 px-2 border border-black w-60" id="prain"
                            @click="setActiveVarPanel('rain')">

                            <div class="flex justify-center gap-4 p-2">
                                <div class="flex items-center">
                                    <i class="fas fa-cloud-rain text-5xl"></i>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <div class="text-lg">RAIN (mm)</div>
                                    <div class="flex justify-between items-end gap-1">
                                        <div class="text-lg font-light">hour</div>
                                        <div class="text-4xl font-bold ml-1" x-text="activeStationObs.rr"></div>
                                    </div>
                                    <div class="flex justify-between items-end gap-1">
                                        <div class="text-lg font-light">day</div>
                                        <div class="text-4xl font-bold ml-1" x-text="activeStationObs.rain24h"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="group hidden md:flex items-center justify-center absolute right-2 top-2 shadow-lg w-5 h-5 text-xs stroke-current text-gray-800 hover:text-gray-900 hover:bg-blue-300 rounded-full"
                                @click="showMoreInfo = true" x-show="!showMoreInfo & (activeVarPanel === 'rain')">
                                <i class="fas fa-info"></i>
                                <div
                                    class="absolute w-32 bottom-full px-3 py-2 z-10 opacity-0 bg-black text-white text-center text-xs rounded-lg group-hover:opacity-100 pointer-events-none">
                                    <span>More information</span>
                                    <svg class="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px"
                                        viewBox="0 0 255 255" xml:space="preserve">
                                        <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <!-- Info Temperature Panel -->
                        <div :class="activeVarPanel === 'temp' ? 'bg-blue-600 text-gray-900' : 'bg-blue-300 text-gray-800'"
                            class="relative flex flex-col cursor-pointer py-3 px-2 border border-black w-60" id="ptemp"
                            @click="setActiveVarPanel('temp')">

                            <div class="flex justify-center gap-4 p-2">
                                <div class="flex items-center">
                                    <i class="fas fa-thermometer-half text-5xl"></i>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <div class="text-lg">TEMPERATURE (&deg;C)</div>
                                    <div class="text-4xl font-bold" x-text="activeStationObs.temp">
                                    </div>
                                    <div class="flex justify-center items-end">
                                        <div><i class="fas fa-thermometer-empty text-xl"></i></div>
                                        <div class="text-2xl font-semibold mr-2" x-text="activeStationObs.tn"></div>
                                        <div><i class="fas fa-thermometer-full text-xl"></i></div>
                                        <div class="text-2xl font-semibold" x-text="activeStationObs.tx"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="group hidden md:flex items-center justify-center absolute right-2 top-2 shadow-lg w-5 h-5 text-xs stroke-current text-gray-800 hover:text-gray-900 hover:bg-blue-300 rounded-full"
                                @click="showMoreInfo = true" x-show="!showMoreInfo & (activeVarPanel === 'temp')">
                                <i class="fas fa-info"></i>
                                <div
                                    class="absolute w-32 bottom-full px-3 py-2 z-10 opacity-0 bg-black text-white text-center text-xs rounded-lg group-hover:opacity-100 pointer-events-none">
                                    <span>More information</span>
                                    <svg class="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px"
                                        viewBox="0 0 255 255" xml:space="preserve">
                                        <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex" :class="showMoreInfo ? 'flex-col' : 'flex-col gap-2 md:flex-row md:gap-4'">
                        <!-- Info Wind Panel -->
                        <div :class="activeVarPanel === 'wind' ? 'bg-blue-600 text-gray-900' : 'bg-blue-300 text-gray-800'"
                            class="relative flex flex-col cursor-pointer py-3 px-2 border border-black w-60" id="pwind"
                            @click="setActiveVarPanel('wind')">

                            <div class="flex justify-center gap-4 p-2">
                                <div class="flex items-center">
                                    <i class="fas fa-wind text-5xl"></i>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <div class="text-lg">WIND (m/s)</div>
                                    <div class="text-4xl font-bold" x-text="activeStationObs.wspd"></div>
                                    <div class="flex justify-center items-center">
                                        <div><i class="wi wi-wind-direction text-xl"></i></div>
                                        <div class="text-2xl font-semibold ml-1"
                                            x-text="`${activeStationObs.wdir}&deg;`">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="group hidden md:flex items-center justify-center absolute right-2 top-2 shadow-lg w-5 h-5 text-xs stroke-current text-gray-800 hover:text-gray-900 hover:bg-blue-300 rounded-full"
                                @click="showMoreInfo = true" x-show="!showMoreInfo & (activeVarPanel === 'wind')">
                                <i class="fas fa-info"></i>
                                <div
                                    class="absolute w-32 bottom-full px-3 py-2 z-10 opacity-0 bg-black text-white text-center text-xs rounded-lg group-hover:opacity-100 pointer-events-none">
                                    <span>More information</span>
                                    <svg class="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px"
                                        viewBox="0 0 255 255" xml:space="preserve">
                                        <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <!-- Info Pressure Panel -->
                        <div :class="activeVarPanel === 'pres' ? 'bg-blue-600 text-gray-900' : 'bg-blue-300 text-gray-800'"
                            class="relative flex flex-col justify-center cursor-pointer py-3 px-2 border border-black w-60"
                            id="ppres" @click="setActiveVarPanel('pres')">

                            <div class="flex justify-center gap-4 p-2">
                                <div class="flex items-center">
                                    <i class="wi wi-barometer text-5xl"></i>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <div class="text-lg">PRESSURE (hPa)</div>
                                    <div class="text-4xl font-bold" x-text="activeStationObs.pres"></div>
                                </div>
                            </div>
                            <div class="group hidden md:flex items-center justify-center absolute right-2 top-2 shadow-lg w-5 h-5 text-xs stroke-current text-gray-800 hover:text-gray-900 hover:bg-blue-300 rounded-full"
                                @click="showMoreInfo = true" x-show="!showMoreInfo & (activeVarPanel === 'pres')">
                                <i class="fas fa-info"></i>
                                <div
                                    class="absolute w-32 bottom-full px-3 py-2 z-10 opacity-0 bg-black text-white text-center text-xs rounded-lg group-hover:opacity-100 pointer-events-none">
                                    <span>More information</span>
                                    <svg class="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px"
                                        viewBox="0 0 255 255" xml:space="preserve">
                                        <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- More Info Panel -->
                <div class="hidden md:relative md:flex text-base md:text-lg w-52 lg:w-64 md:h-full"
                    x-show="showMoreInfo" x-cloak>
                    <div class="group flex items-center justify-center absolute right-2 top-2 cursor-pointer shadow-lg w-5 h-5 text-xs stroke-current text-gray-800 hover:text-gray-900 hover:bg-blue-300 rounded-full"
                        @click="showMoreInfo = false">
                        <i class="fas fa-times"></i>
                        <div
                            class="absolute w-32 bottom-full px-3 py-2 z-10 opacity-0 bg-black text-white text-center text-xs rounded-lg group-hover:opacity-100 pointer-events-none">
                            <span>Hide</span>
                            <svg class="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px"
                                viewBox="0 0 255 255" xml:space="preserve">
                                <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
                            </svg>
                        </div>
                    </div>
                    <div class="flex bg-blue-600 pt-5 px-5 border border-black border-l-0 break-normal text-left">
                        <!-- More Info Rain Panel -->
                        <div x-show="activeVarPanel === 'rain'">
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
                        <div x-show="activeVarPanel === 'temp'">
                            At <span class="font-semibold" x-text="activeStation.address"></span>, the temperature at
                            <span class="font-semibold" x-text="timeStr">12 nn</span> was
                            <span class="font-semibold" x-text="`${activeStationObs.temp} &deg;C`">32 &deg;C</span> but
                            feels like <span class="font-semibold" x-text="`${activeStationObs.hi} &deg;C`">58
                                &deg;C</span>
                            because of the
                            humidity. In the past 24 hours, local temperature got up to <span class="font-semibold"
                                x-text="`${activeStationObs.tx} &deg;C`">100 &deg;C</span> and
                            got
                            as low as <span class="font-semibold" x-text="`${activeStationObs.tn} &deg;C`">-10
                                &deg;C</span>.
                        </div>
                        <!-- More Info Wind Panel -->
                        <div x-show="activeVarPanel === 'wind'">
                            At <span class="font-semibold" x-text="activeStation.address"></span>, the wind at <span
                                class="font-semibold" x-text="timeStr">12 nn</span> was blowing
                            from <span class="font-semibold" x-text="`${activeStationObs.wdir}&deg;`">0&deg;</span> at
                            <span class="font-semibold" x-text="`${activeStationObs.wspd} m/s`">0 m/s</span>.
                        </div>
                        <!-- More Info Pressure Panel -->
                        <div x-show="activeVarPanel === 'pres'">
                            At <span class="font-semibold" x-text="activeStation.address"></span>, the air pressure was
                            <span class="font-semibold" x-text="`${activeStationObs.pres} mb`">0 mb</span>
                            at <span class="font-semibold" x-text="timeStr">12 nn</span>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Script -->
    <script src="dist/main.js" type="text/javascript"></script>
</body>

</html>