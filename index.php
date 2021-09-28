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
            <select x-model="activeStationId" x-effect="handleStationIdChange">
                <template x-if="visibleStations">
                    <template x-for="(st, id) in visibleStations" :key="id">
                        <option :key="id" :value="st.properties.id" x-text="st.properties.name"></option>
                    </template>
                </template>
            </select>
        </div>
        <div class="flex flex-col-reverse md:flex-row md:justify-center gap-4 p-6">
            <div class="flex md:flex md:flex-col hidden m-auto md:mx-0">
                <div class="flex flex-col items-start mb-6" x-show="showMoreInfo">
                    <div class="text-lg font-semibold" x-text="activeStation.name"></div>
                    <div class="text-base italic font-light" x-text="`as of ${dateTimeStr}`"></div>
                </div>
                <div class="relative">
                    <!-- Map -->
                    <div id="map" class="shadow" style='width: 400px; height: 470px;'> </div>
                    <div x-show="swatches"
                        class="absolute flex flex-col justify-center m-1 bottom-0 right-0 bg-white p-2 rounded-md shadow opacity-90"
                        x-cloak>
                        <div class="flex justify-center mb-2">
                            <div class="text-xs font-semibold justify-center" x-text="`${varName} (${varUnit})`"></div>
                        </div>
                        <div class="flex">
                            <template x-for="(sw, idx) in swatches" :key="sw.color">
                                <div class="flex flex-col">
                                    <div class="w-8 h-5 border border-black" :class="idx > 0 ? 'border-l-0' : ''"
                                        :style="`background-color:${sw.color};`"></div>
                                    <template x-if="idx !== 0">
                                        <div class="text-xs self-center -ml-8" x-text="sw.label"></div>
                                    </template>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex text-sm text-center items-center">
                <!-- Info Panel -->
                <div class="flex flex-col items-center" :class="showMoreInfo ? '' : 'gap-2 md:gap-4'">
                    <div class="flex flex-col md:items-start w-full" :class="showMoreInfo ? 'md:hidden' : ''">
                        <div class="text-lg font-semibold" x-text="activeStation.name"></div>
                        <div class="text-base italic font-light" x-text="`as of ${dateTimeStr}`"></div>
                    </div>
                    <div class="flex" :class="showMoreInfo ? 'flex-col' : 'flex-col gap-2 md:flex-row md:gap-4'">
                        <!-- Info Rain Panel -->
                        <div :class="activeVariable === 'rain' ? 'bg-blue-600 text-gray-900' : 'bg-blue-300 text-gray-800'"
                            class="relative flex flex-col justify-center cursor-pointer py-3 px-2 border border-black w-60"
                            id="prain" @click="setActiveVariable('rain')">

                            <div class="flex justify-evenly">
                                <div class="flex items-center">
                                    <i class="fas fa-cloud-rain text-5xl"></i>
                                </div>
                                <div class="flex flex-col">
                                    <div class="text-lg">RAIN (mm)</div>
                                    <div class="flex justify-evenly items-end gap-1">
                                        <div class="text-lg font-light">Now</div>
                                        <div class="text-4xl font-bold ml-1.5" x-text="activeStation.obs.rr"></div>
                                    </div>
                                    <!-- <div class="flex justify-evenly items-end gap-1 mt-0.5">
                                        <div class="text-base font-light pb-0.5">Day</div>
                                        <div class="text-2xl font-bold ml-1.5" x-text="activeStation.obs.rainDay"></div>
                                    </div> -->
                                    <div class="flex justify-evenly items-end gap-1">
                                        <div class="flex flex-col text-sm font-light pb-0.5">
                                            <div class="-mb-2">24hr</div>
                                            <div>total</div>
                                        </div>
                                        <div class="text-2xl font-bold ml-1.5" x-text="activeStation.obs.rain24h"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="group hidden md:flex items-center justify-center absolute right-2 top-2 shadow-lg w-5 h-5 text-xs stroke-current text-gray-800 hover:text-gray-900 hover:bg-blue-300 rounded-full"
                                @click="showMoreInfo = true" x-show="!showMoreInfo & (activeVariable === 'rain')">
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
                        <div :class="activeVariable === 'temp' ? 'bg-blue-600 text-gray-900' : 'bg-blue-300 text-gray-800'"
                            class="relative flex flex-col justify-center cursor-pointer py-3 px-2 border border-black w-60"
                            id="ptemp" @click="setActiveVariable('temp')">

                            <div class="flex justify-evenly">
                                <div class="flex items-center">
                                    <i class="fas fa-thermometer-half text-5xl"></i>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <div class="text-lg">TEMPERATURE (&deg;C)</div>
                                    <div class="text-4xl font-bold" x-text="activeStation.obs.temp">
                                    </div>
                                    <div class="flex justify-center items-end gap-1">
                                        <div class="pb-0.5">Min</div>
                                        <div class="text-2xl font-semibold mr-1" x-text="activeStation.obs.tn"></div>
                                        <div class="pb-0.5">Max</div>
                                        <div class="text-2xl font-semibold" x-text="activeStation.obs.tx"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="group hidden md:flex items-center justify-center absolute right-2 top-2 shadow-lg w-5 h-5 text-xs stroke-current text-gray-800 hover:text-gray-900 hover:bg-blue-300 rounded-full"
                                @click="showMoreInfo = true" x-show="!showMoreInfo & (activeVariable === 'temp')">
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
                        <div :class="activeVariable === 'wind' ? 'bg-blue-600 text-gray-900' : 'bg-blue-300 text-gray-800'"
                            class="relative flex flex-col justify-center cursor-pointer py-3 px-2 border border-black w-60"
                            id="pwind" @click="setActiveVariable('wind')">

                            <div class="flex justify-evenly">
                                <div class="flex items-center">
                                    <i class="fas fa-wind text-5xl"></i>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <div class="text-lg">WIND (m/s)</div>
                                    <div class="text-4xl font-bold" x-text="activeStation.obs.wspd"></div>
                                    <div class="flex justify-center items-center">
                                        <div><i class="wi wi-wind text-xl"
                                                :class="activeStation.obs.wdirStr ? `wi-from-${activeStation.obs.wdirStr.toLowerCase()}` : ''"></i>
                                        </div>
                                        <div class="text-2xl font-semibold ml-1"
                                            x-text="`${activeStation.obs.wdirStr}`">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="group hidden md:flex items-center justify-center absolute right-2 top-2 shadow-lg w-5 h-5 text-xs stroke-current text-gray-800 hover:text-gray-900 hover:bg-blue-300 rounded-full"
                                @click="showMoreInfo = true" x-show="!showMoreInfo & (activeVariable === 'wind')">
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
                        <div :class="activeVariable === 'pres' ? 'bg-blue-600 text-gray-900' : 'bg-blue-300 text-gray-800'"
                            class="relative flex flex-col justify-center cursor-pointer py-3 px-2 border border-black w-60"
                            id="ppres" @click="setActiveVariable('pres')">

                            <div class="flex justify-evenly">
                                <div class="flex items-center">
                                    <i class="wi wi-barometer text-5xl"></i>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <div class="text-lg">PRESSURE (hPa)</div>
                                    <div class="text-4xl font-bold" x-text="activeStation.obs.pres"></div>
                                </div>
                            </div>
                            <div class="group hidden md:flex items-center justify-center absolute right-2 top-2 shadow-lg w-5 h-5 text-xs stroke-current text-gray-800 hover:text-gray-900 hover:bg-blue-300 rounded-full"
                                @click="showMoreInfo = true" x-show="!showMoreInfo & (activeVariable === 'pres')">
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
                            class="absolute w-20 bottom-full px-3 py-2 z-10 opacity-0 bg-black text-white text-center text-xs rounded-lg group-hover:opacity-100 pointer-events-none">
                            <span>Hide</span>
                            <svg class="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px"
                                viewBox="0 0 255 255" xml:space="preserve">
                                <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
                            </svg>
                        </div>
                    </div>
                    <div class="flex bg-blue-600 pt-5 px-5 border border-black border-l-0 break-normal text-left">
                        <!-- More Info Rain Panel -->
                        <div x-show="activeVariable === 'rain'">
                            At <span class="font-semibold" x-text="activeStation.name"></span>, there was <span
                                class="font-semibold" x-text="`${(activeStation.obs.rr * 10.)} mm`">0 mm</span>
                            rainfall
                            received at <span class="font-semibold" x-text="timeStr">12 nn</span>. There have been <span
                                class="font-semibold" x-text="`${activeStation.obs.rain24h} mm`">0
                                mm</span>
                            accumulated
                            rainfall for the past 24 hours. This is <span class="font-semibold">{ratio}%</span> of the
                            historical
                            maximum
                            24hr rainfall for this
                            area which was <span class="font-semibold">{rain} mm</span>.
                        </div>
                        <!-- More Info Temperature Panel -->
                        <div x-show="activeVariable === 'temp'">
                            At <span class="font-semibold" x-text="activeStation.name"></span>, the temperature at
                            <span class="font-semibold" x-text="timeStr">12 nn</span> was
                            <span class="font-semibold" x-text="`${activeStation.obs.temp} &deg;C`">32 &deg;C</span> but
                            feels like <span class="font-semibold" x-text="`${activeStation.obs.hi} &deg;C`">58
                                &deg;C</span>
                            because of the
                            humidity. In the past 24 hours, local temperature got up to <span class="font-semibold"
                                x-text="`${activeStation.obs.tx} &deg;C`">100 &deg;C</span> and
                            got
                            as low as <span class="font-semibold" x-text="`${activeStation.obs.tn} &deg;C`">-10
                                &deg;C</span>.
                        </div>
                        <!-- More Info Wind Panel -->
                        <div x-show="activeVariable === 'wind'">
                            At <span class="font-semibold" x-text="activeStation.name"></span>, the wind at <span
                                class="font-semibold" x-text="timeStr">12 nn</span> was blowing
                            from <span class="font-semibold" x-text="`${activeStation.obs.wdirStr}`"></span> at
                            <span class="font-semibold" x-text="`${activeStation.obs.wspd} m/s`">0 m/s</span>.
                        </div>
                        <!-- More Info Pressure Panel -->
                        <div x-show="activeVariable === 'pres'">
                            At <span class="font-semibold" x-text="activeStation.name"></span>, the air pressure was
                            <span class="font-semibold" x-text="`${activeStation.obs.pres} mb`">0 mb</span>
                            at <span class="font-semibold" x-text="timeStr">12 nn</span>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>