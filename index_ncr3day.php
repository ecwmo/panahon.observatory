<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<?php
    /*
    Changes (by Arielle):
        removed all unnecessary www.observatory.ph references;
        changed links to some old/static/archivable files, see
            /home/webman/websites/panahon.observatory.ph directory;
        updated MO and XU PNG graph URIs;
        updated links pointing to current www.observatory.ph pages;
        MO banner as well as the icon has been copied to this directory.
    
    What to expect:
        "http://www.observatory.ph/resources/models/kishou/index.php"
            will respond with a 404; the page no longer exists in www;
        Met data graphs are also available at:
            http://www.observatory.ph/Metdata;
        track.gif (JTWC) images cannot be auto-downloaded at the moment as the
            server responds with "Forbidden"; but JTWC images should be in
            resources/jtwc, which is a symlink to /home/webman/shared-assets/ext-resources/jtwc-- the cronjob has been turned off;
        resources/met/(station) PNG images ought to be fresh as we are already
            automatically downloading these from Dagat;
        fresh Kochi satellite images are also available at resources/kochi,
            if there is a need for them;
        fresh CWB image available as resouces/cwb/latest.jpg; no more need for
            consulting a .txt file which saves the last download date.
    */
?>
 <head>
  <title>Panahon Ngayon - Local Meteorology by the Manila Observatory</title>
  <style type="text/css">
   a:link, a:visited {
	color: #000000;
	text-decoration: none;
    }
   a:hover {
	color: #333333;
	text-decoration: underline;
    }
   .b0101 {
    left: 5px;
    position: absolute;
	top: 65px;
    }
   .b0102 {
    left: 362px;
    position: absolute;
	top: 65px;
    }
   .b0201 {
    left: 5px;
    position: absolute;
	top: 541px;
    }
   .b0202 {
    left: 362px;
    position: absolute;
	top: 541px;
    }
    .b0301 {
    left: 5px;
    position: absolute;
        top: 1017px;
    }
   .b0302 {
    left: 362px;
    position: absolute;
        top: 1017px;
    }
    .banner {
    left: 0px;
    position: absolute;
	top: 0px;
	width: 745px;
    }
   .box {
    background-color: #cccccc;
	border-radius: 10px;
	color: #000000;
	font-family: "Century Gothic", "Gill Sans", Arial, san-serif;
	font-size: 12px;
	padding: 10px;
    }
   .bfull {
	height: 380px;  
	width: 690px;	
    }
   .bfull img {
	border: 1px solid #000000;
	padding: 3px;
    width: 680px;
    }
   .bhalf {
	height: 450px;  
	width: 332px;	
    }
   .bhalf img {
	border: 1px solid #000000;
	padding: 3px;
    width: 325px;
    }
   .bhistory {
	height: 350px;  
	width: 690px;
    }
   .blinks {
	height: 570px;  
	width: 690px;
    }
   .blong {
	height: 775px;  
	width: 332px;
    }
   .blong img {
	border: 1px solid #000000;
	padding: 3px;
    width: 325px;
    }
   body {
    background-color: #3366ff;
    }
   .bother {
	height: 220px;  
	width: 690px;
    }
   .content {
    background-color: #ffffff;
	height: 6600px;
    left: 20%;
	position: absolute;
	top: 0px;
	width: 745px;
    }
   .date {
	color: #000000;
	font-family: "Century Gothic", "Gill Sans", Arial, san-serif;
	font-size: 12px;
	left: 8px;
	position: absolute;
	top: 115px;
    }
   .disclaimer {
	color: #000000;
	font-family: "Century Gothic", "Gill Sans", Arial, san-serif;
	font-size: 10px;
	left: 15px;
	position: absolute;
	top: 6520px;
	width: 730px;
    }
   h2 {
    background-color: #6699ff;
	border-radius: 10px;
	color: #ffffff;
	font-family: "Century Gothic", "Gill Sans", Arial, san-serif;
	font-size: 18px;
	font-weight: bold;
	padding: 10px;
	width: 700px;
    }
  h4 {
        color: #FF0000;
        font-family: "Century Gothic", "Gill Sans", Arial, san-serif;
        font-size: 14px;
        font-weight: bold;
        padding: 10px;  
        width: 700px;
   }  
 h5 {
      	color: #FF0000;
        font-family: "Century Gothic", "Gill Sans", Arial, san-serif;
        font-size: 12px;
        font-weight: bold;
        padding: 10px;
        width: 700px;
   }
 

  .links {
    background-color: #cccccc;
	color: #6699ff;
	font-family: "Century Gothic", "Gill Sans", Arial, san-serif;
	font-size: 11px;
	font-weight: bold;
	left: 0px;
	padding: 10px;
	position: absolute;
	top: 150px;
	width: 725px;
    }
   .main {
	color: #000000;
	font-family: "Century Gothic", "Gill Sans", Arial, san-serif;
	font-size: 12px;
	left: 556px;
	position: absolute;
	top: 115px;
    }
   .section01 {
    left: 15px;
    position: absolute;
	top: 180px;
    }
    .section01b {
    left: 15px;
    position: absolute;
        top: 220px;
    }
    .section01c {
    left: 15px;
    position: absolute;
        top: 250px;
    }
   .section02 {
    left: 15px;
    position: absolute;
	top: 1766px;
    }
   .section03 {
    left: 15px;
    position: absolute;
	top: 2781px;
    }
   .section04 {
    left: 15px;
    position: absolute;
	top: 3239px;
    }
   .section05 {
    left: 15px;
    position: absolute;
	top: 4244px;
    }
   .section06 {
    left: 15px;
    position: absolute;
	top: 4550px;
    }
   .section07 {
    left: 15px;
    position: absolute;
	top: 5405px;
    }
   .section08 {
    left: 15px;
    position: absolute;
	top: 6060px;
    }
   td, th {
    background-color: #ffffff;
	border: 1px solid #000000;
	padding-left: 10px;
	padding-right: 10px;
    }
  </style>
  <link rel="icon" href="/mo-icon.png" type="image/png" />
 </head>
 <body>
  <div class="content">

  <img src="./mo-banner.jpg" class="banner"/>
  <p class="date"><?php echo date("j F Y, H:i T");?></p>
  <p class="main">
   <a href="http://www.observatory.ph">home</a> |
   <a href="http://www.observatory.ph/Aboutus">about us </a> |
   <a href="http://www.observatory.ph/Contactus"> contact us</a>
  </p>
  <div class="links">
   <a href="#currentconditions">Current Conditions</a> |
   <a href="#mobservations">MO Observations</a> |
   <a href="#hourlyrainfall">Rainfall</a> |
   <a href="#potentialimpacts">Potential Impacts</a> |
   <a href="#latestwforecasts">Weather Forecast</a> |
   <a href="#otherobservations">Other Observations</a> |
   <a href="#histobservations">Historical Information </a> 
  </div>

<div class="section01">
   <h2 id="mmbservations">3-Day Metro Manila Rainfall Observations:
   <a href="http://panahon.observatory.ph/index.php" target="_blank"> 24-Hr graphs are here</a>
   </h2>
   </div>
<div class="section01b">
   <h4>Ondoy 24 Hour Rain in Manila Observatory : 368.6 mm, in Science Garden (c/o PAGASA) : 454.9 mm.</h4>
   </div>

<div class="section01c">
    <h5>The average monthly total rain in Science Garden (1961-2010) is 500.78 mm & in Port Area (1949-2009) is 436.42 mm.</h5>

    <div class="box b0101 bhalf">
    <h3><a href="http://www.observatory.ph/Metdata/MO" target="_blank">Manila Observatory, Quezon City</a></h3>
    <img src="/resources/met/MO/rain3day.png" alt="Manila Observatory, Quezon City 3-Day Rainfall (mm)"/>

    <ul>
     <li>The bar graph in the figure shows hourly rainfall (the values are seen on the left y-axis).</li>
	 <li>The filled in section shows the accumulated rain (the values are seen on the right y-axis) at Manila Observatory for the last 3 days.</li>
         <li> The image was last updated <?php
	// Open the text file
	$f = fopen('/home/webman/websites/panahon.observatory.ph/resources/met/MO/datetime.csv', "r");
        echo fgets($f); 
	// Close the text file
	fclose($f);
	?> </li>
    </ul>
   </div>
   <div class="box b0102 bhalf">
    <h3><a href="http://www.observatory.ph/Metdata/mo001" target="_blank">Nangka, Marikina City</a></h3>
    <img src="/resources/met/mo001/rain3day.png" alt="Nangka, Marikina City 3 Day Rainfall (mm)"/>
    <ul>
     <li>The bar graph in the figure shows hourly rainfall (the values are seen on the left y-axis).</li>
	 <li>The filled in section shows the accumulated rain (the values are seen on the right y-axis) at Nangka, Marikina City for the last 3 days.</li>
         <li> The image was last updated <?php
        // Open the text file
        $f = fopen('/home/webman/websites/panahon.observatory.ph/resources/met/mo001/datetime.csv', "r");
        echo fgets($f);
        // Close the text file
        fclose($f);
        ?> </li>
 
     </ul>
   </div>
   <div class="box b0201 bhalf">
    <h3><a href="http://www.observatory.ph/Metdata/mo004" target="_blank">M0-MMDA Station, Guadalupe</a></h3>
    <img src="/resources/met/mo004/rain3day.png" alt="MO-MMDA Guadalupe 3-Day Rainfall (mm)"/>
    <ul>
     <li>The bar graph in the figure shows hourly rainfall (the values are seen on the left y-axis).</li>
	 <li>The filled in section shows the accumulated rain (the values are seen on the right y-axis) at MMDA-MO Guadalupe for the last 3 days.</li>
          <li> The image was last updated <?php
        // Open the text file
        $f = fopen('/home/webman/websites/panahon.observatory.ph/resources/met/mo004/datetime.csv', "r");
        echo fgets($f);
        // Close the text file
        fclose($f);
        ?> </li>

    </ul>
   </div>
   <div class="box b0202 bhalf">
    <h3><a href="http://www.observatory.ph/Metdata/makati01" target="_blank">Bgy. San Lorenzo, Makati City</a></h3>
    <img src="/resources/met/makati01/rain3day.png" alt="Bgy. Forbes Park, Makati City 3-Day Rainfall (mm)"/>
    <ul>
     <li>The bar graph in the figure shows hourly rainfall (the values are seen on the left y-axis).</li>
	 <li>The filled in section shows the accumulated rain (the values are seen on the right y-axis) at Bgy. San Lorenzo, Makati City for the last 3 days.</li>
          <li> The image was last updated <?php
        // Open the text file
        $f = fopen('/home/webman/websites/panahon.observatory.ph/resources/met/makati01/datetime.csv', "r");
        echo fgets($f);
        // Close the text file
        fclose($f);
        ?> </li>
        <li>Data made available to the Manila Observatory through partnership with Makati City.</li>
    </ul>
   </div>
   <div class="box b0301 bhalf">
    <h3><a href="http://www.observatory.ph/Metdata/makati03" target="_blank">Bgy. San Antonio, Makati City</a></h3>
    <img src="/resources/met/makati03/rain3day.png" alt="Bgy. San Antonio, Makati City 3-Day Rainfall (mm)"/>
    <ul>
     <li>The bar graph in the figure shows hourly rainfall (the values are seen on the left y-axis).</li>
         <li>The filled in section shows the accumulated rain (the values are seen on the right y-axis) at Bgy. San Antonio, Makati City for the last 3 days.</li>
          <li> The image was last updated <?php
        // Open the text file
        $f = fopen('/home/webman/websites/panahon.observatory.ph/resources/met/makati03/datetime.csv', "r");
        echo fgets($f);
        // Close the text file
        fclose($f);
        ?> </li>
         <li>Data made available to the Manila Observatory through partnership with Makati City.</li>
    </ul>
   </div>
   <div class="box b0302 bhalf">
    <h3><a href="http://www.observatory.ph/Metdata/makati06" target="_blank">OSMAK Bgy. Pembo, Makati City</a></h3>
    <img src="/resources/met/makati06/rain3day.png" alt="OSMAK Bgy. Pembo, Makati City 3-Day Rainfall (mm)"/>
    <ul>
     <li>The bar graph in the figure shows hourly rainfall (the values are seen on the left y-axis).</li>
         <li>The filled in section shows the accumulated rain (the values are seen on the right y-axis) at OSMAK Bgy. Pembo, Makati City for the last 3 days.</li>
          <li> The image was last updated <?php
        // Open the text file
        $f = fopen('/home/webman/websites/panahon.observatory.ph/resources/met/makati06/datetime.csv', "r");
        echo fgets($f);
        // Close the text file
        fclose($f);
        ?> </li>
        <li>Data made available to the Manila Observatory through partnership with Makati City.</li>

    </ul>
   </div>
 


  </div>
  
  <div class="section02">
   <h2 id="currentconditions">Current Conditions</h2>
   <div class="box b0101 bhalf">
    <h3>Rainfall (mm)</h3>
    <img src="./resources/met/MO/rain.png" alt="MetMO Rainfall (mm)"/>
    <ul>
     <li>The bar graph in the figure shows hourly rainfall (the values are seen on the left y-axis).</li>

	 <li>The height of the light blue area shows the accumulated rain (the values are seen on the 
right y-axis) at the Manila Observatory for the last 24 hours.</li>
    </ul>
   </div>
   <div class="box b0102 bhalf">
    <h3>MTSAT Infrared Image</h3>
    <a href="http://tropic.ssec.wisc.edu/real-time/imagemain.php?&basin=westpac&prod=irn&sat=gms" target="_blank">
     <img src="http://tropic.ssec.wisc.edu/real-time/westpac/images/irngms.GIF" alt="CIMSS IR Satellite"/>
    </a>

    <ul>
     <li>The image above is taken from Cooperative Institute for Meteorological Satellite Studies (CIMSS).</li>
	 <li>Timestamp is ~1-2 hours earlier than current time.</li>
	 <li>Areas of white and red, especially bright white, indicate cloud systems that have greater potential for rainfall.</li>
    </ul>
   </div>
   <div class="box b0201 bhalf">

    <h3>Typhoon Track</h3>
    <a href="http://www.usno.navy.mil/JTWC/" target="_blank">
     <img style="opacity: 1;" src="/resources/jtwc/latest.gif" alt="JTWC Typhoon Track"/>
    </a>
    <ul>
     <li>The image above is taken from the Joint Typhoon Warning Center (JTWC).</li>
    </ul>
   </div>

   <div class="box b0202 bhalf">
    <h3>MTSAT Visible Image</h3>
    <a href="http://www.cwb.gov.tw/V7/observe/satellite/Sat_EA.htm" target="_blank">
     <img src="/resources/cwb/latest.jpg" alt="CWB Visible Satellite"/>
     
    </a>
    <ul>
     <li>The image above is courtesy of Central Weather Bureau, Taiwan, R.O.C.</li>
    </ul>

   </div>
  </div>

  <div class="section03">
   <h2 id="hourlyrainfall">Hourly Accumulated Rainfall</h2>

   <div class="box b0101 bfull">
    <a href="http://sharaku.eorc.jaxa.jp/GSMaP/" target="_blank">
     <img src="/resources/jaxa-rain/latest.jpg" alt="JAXA Accumulated Rainfall"/>
    </a>
	<img src="/static/jaxa_color_bar.png" alt="JAXA Accumulated Rainfall Colorbar"/>
	<ul>
     <li>Rainfall estimate courtesy of Japan Aerospace Exploration Agency (JAXA).</li>
	 <li>Color bar indicates rain amount in millimeters per hour.</li>

    </ul>
   </div>
  </div>

  <div class="section04">
   <h2 id="mobservations">MO Observations</h2>
   <div class="box b0101 bhalf">
    <h3>Rainfall (mm)</h3>
    <img src="/resources/met/MO/rain.png" alt="MetMO Rainfall (mm)"/>

    <ul>
     <li>The bar graph in the figure shows hourly rainfall (the values are seen on the left y-axis).</li>
	 <li>The height of the light blue area shows the accumulated rain (the values are seen on the 
right y-axis) at the Manila Observatory for the last 24 hours.</li>
    </ul>
   </div>
   <div class="box b0102 bhalf">
    <h3>Barometric Pressure</h3>

    <img src="/resources/met/MO/pressure.png" alt="MetMO Pressure"/>
    <ul>
     <li>The red line shows the hourly trend of the barometric pressure for the past 24 hours.</li>
    </ul>
   </div>
   <div class="box b0201 bhalf">
    <h3>Wind Speed</h3>
    <img src="/resources/met/MO/windspeed.png" alt="MetMO Wind Speed"/>

    <ul>
     <li>The black circles in the figure shows the average wind speed, the green circles indicate the 
maximum wind speed.</li>
     <li>The green line represents the maximum wind speed during Typhoon Frank in 2008.</li>
    </ul>
   </div>
   <div class="box b0202 bhalf">
    <h3>Ondoy's 24hr Rainfall Data</h3>

    <img src="/static/ondoy.png" alt="Ondoy Rainfall"/>
    <ul>
     <li>The bar graphs show hourly rain which began on 12 AM PHT, September 26, 2009. The rains lasted for a whole day, bringing accumulated rain of 368.6 mm. The maximum pressure drop around noontime occurred after the heaviest rainfall.</li>
    </ul>
   </div>
  </div>

  <div class="section05">
   <h2 id="otherobservations">Observations from Other Locations</h2>
   <div class="box b0101 bother">
	<ul>
         <li><a href="http://www.observatory.ph/Metdata/MO">Ateneo de Manila Campus</a></li>
         <li><a href="http://www.observatory.ph/Metdata/mo002">Ateneo de Zamboanga</a></li>
         <li><a href="http://www.observatory.ph/Metdata/makati05">Brgy. Forbes Park, Makati City</a></li>
         <li><a href="http://www.observatory.ph/Metdata/makati03">Brgy. San Antonio, Makati City</a></li>
         <li><a href="http://www.observatory.ph/Metdata/makati01">Brgy. San Lorenzo, Makati City</a></li>
         <li><a href="http://www.observatory.ph/Metdata/makati04">Brgy. West Rembo, Makati City</a></li>
         <li><a href="http://www.observatory.ph/Metdata/zipzone">Dahilayan Adventure Park, Bukidnon</a></li>
         <li><a href="http://www.observatory.ph/Metdata/makati02">Makati City Hall, Makati City</a></li>
         <li><a href="http://www.observatory.ph/Metdata/MOD">Manila Observatory, Davao</a></li>
         <li><a href="http://www.observatory.ph/Metdata/mo004">MMDA-MO Station, Guadalupe</a></li>
         <li><a href="http://www.observatory.ph/Metdata/mo001">Monitoring Station at Nangka, Marikina City</a></li>
         <li><a href="http://www.observatory.ph/Metdata/mo003">Notre Dame of Marbel University, Koronadal City</a></li>
         <li><a href="http://www.observatory.ph/Metdata/makati06">Ospital ng Makati, Bgy. Pembo, Makati City</a></li>
         <li><a href="http://www.observatory.ph/Metdata/xuws2">Xavier University, Ateneo de Cagayan</a></li>
    </ul>
   </div>
  </div>
  
<!--  <div class="section04">
   <h2 id="mobservations">Xavier University Observations (Cagayan de Oro, City)</h2>
   <div class="box b0101 bhalf">
    <h3>Rainfall (mm)</h3>
    <img src="/resources/met/xuws2/rain.png" alt="Cagayan de Oro City Rainfall (mm)"/>

    <ul>
     <li>The bar graph in the figure shows hourly rainfall (the values are seen on the left y-axis).</li>
	 <li>The filled in section shows the accumulated rain (the values are seen on the right y-axis) at Xavier University for the last 24 hours.</li>
    </ul>
   </div>
   <div class="box b0102 bhalf">
    <h3>Barometric Pressure</h3>

    <img src="/resources/met/xuws2/pressure.png" alt="Cagayan de Oro City Pressure"/>
    <ul>
     <li>The red line shows the hourly trend of the barometric pressure for the past 24 hours.</li>
    </ul>
   </div>
   <div class="box b0201 bhalf">
    <h3>Wind Speed</h3>
    <img src="/resources/met/xuws2/windspeed.png" alt="Cagayan de Oro City Wind Speed"/>

    <ul>
     <li>The black circles in the figure show the average wind speed, the green circles indicate the 
maximum wind speed.</li>
    </ul>
   </div>
   <div class="box b0202 bhalf">
    <h3>Temperature</h3>
    <img src="/resources/met/xuws2/temperature.png" alt="Cagayan de Oro City Temperature"/>
    <ul>
     <li>The black circles show hourly average temperature at Xavier University.</li>
    </ul>
   </div>
  </div>
-->
  
  <div class="section06">
   <h2 id="potentialimpacts">Potential Impacts</h2>
   <div class="box b0101 blong">
    <h3>Accumulated Rainfall (mm)</h3>
	<a href="/archived/rain_track.php" target="_blank">
     <img src="/static/recent_trmm_icon.gif" alt="TRMM Accumulated Rainfall"/>
    </a>
	<img src="/static/ketsana_trmm_track3_legend.gif" alt="TRMM Legend"/>
	<ul>
     <li>Daily  accumulated rainfall (mm) from 13 February 2012 8AM PHT to 14 February 2012 8AM PHT
 and the  typhoon track.</li>
	 <li>Rainfall data taken from Tropical Rainfall Measuring Mission (TRMM). Positions of typhoon taken from the JTWC.</li>
	 <li>Sources: Goddard Earth Sciences (GES) Data and Information Services Center (DISC), NASA (<a href="http://disc.sci.gsfc.nasa.gov/" target="_blank">http://disc.sci.gsfc.nasa.gov/</a>), and Joint Typhoon Warning Center (<a href="http://www.usno.navy.mil/JTWC/" target="_blank">http://www.usno.navy.mil/JTWC/</a>)</li>

    </ul>
   </div>
   <div class="box b0102 blong">
    <h3>Population Density</h3>
	<a href="/archived/hev_main2.php" target="_blank">
     <img src="/static/popden_povinc_icon.gif" alt="Population Density"/>
    </a>
	<ul>

     <li>Population density is based on 2007 data. </li>
     <li>High density areas are marked by large circles (see the legend of the circles).</li>
     <li>The shaded areas denote landslide prone areas.</li>
    </ul>
   </div>
  </div>
  
  <div class="section07">

   <h2 id="latestwforecasts">Links to Latest Weather Forecast</h2>
   <div class="box b0101 blinks">
    <h3>TRACK</h3>
	<p>The following links would show the path the typhoon has taken in the past and most likely will follow for the future.</p>
	<ul>
     <li><a href="http://www.pagasa.dost.gov.ph/wb/track.gif" target="_blank">PAGASA</a></li>
     <li><a href="http://www.typhoon2000.ph/activetrack.gif" target="_blank">T2k</a> - Latest typhoon tracking information from Typhoon2000.</li>

	 <li><a href="http://www.usno.navy.mil/NOOC/nmfc-ph/RSS/jtwc/warnings/wp2011.gif" target="_blank">NRL</a> - Naval Research Laboratory.</li>
    </ul>
    <h3>RAIN RATE</h3>
	<ul>
     <li><a 
href="http://sharaku.eorc.jaxa.jp/TYPHOON_RT/index.html"target="_blank">AQUA</a> - Advanced Microwave Scanning Radiometer.</li>

     <li><a href="http://trmm.gsfc.nasa.gov/publications_dir/heavy_rain_G5_3.html" target="_blank">GEOS 5</a> - Ongoing Research: GEOS-5 Forecast.</li>
	 <li><a href="http://trmm.gsfc.nasa.gov/affinity/affinity_3hrly_rain.html" target="_blank">TRMM</a> - Tropical Rainfall Measuring Mission.</li>
	 <li><a href="http://www.nrlmry.navy.mil/htdocs_dyn_pregen_sat/PUBLIC/tc_pages/pages/TC.html" target="_blank">NRL</a> - Naval Research 
Laboratory (<a href="http://www.nrlmry.navy.mil/sat_training/tropical_cyclones/trmm/surfacerain/index.html" target="_blank">Limitations of Data</a>)</li>

    </ul>
	<h3>WATER VAPOR/ INFRARED INFORMATION</h3>
	<p>These images are indicative of the amount of moisture in the atmosphere.  Heavy rainfall is more likely in areas of higher moisture values.</p>
	<ul>
     <li><a href="http://www.pagasa.dost.gov.ph/wb/tcsatpic.jpg" target="_blank">PAGASA</a></li>
     <li><a href="http://cimss.ssec.wisc.edu/tropic2/real-time/imagemain.php?&amp;basin=westpac&amp;sat=gms&amp;prod=irn" target="_blank">CIMMS</a> - Cooperative Institute for Meteorological Satellite Studies(CIMMS).</li>

    </ul>
    <h3>WEATHER FORECAST</h3>
	<ul>
     <li><a href="http://www.observatory.ph/resources/models/kishou/index.php" target="_blank">JMA Weather Forecast</a> - Regional Weather Forecast.</li>
     <li><a href="http://www.pagasa.dost.gov.ph/wb/tc_up.html" target="_blank">PAGASA Forecast</a></li>
    </ul>

    <h3>OTHER LINKS</h3>
	<ul>
     <li><a href="http://www.hko.gov.hk/contente.htm" target="_blank">HK Observatory</a> - The Government of Hong Kong Special Administrative Region.</li>
     <li><a href="http://www.nrlmry.navy.mil/TC.html" target ="_blank">NRL</a> - Naval Research Laboratory (The little colored boxes correspond to satellite imagery from different instruments, at different times.  The red "KML" button means that you can open that link in Google Earth and view all the images (and meta data) there.)</li>
     <li><a href="http://noah.dost.gov.ph/" target ="_blank">NOAH</a> - Philippine Nationwide Assessment of Hazards (Click on the options in the dropdown boxes, zoom in and out to your desired location.)</li>
    </ul>

   </div>
  </div>
  
 
  <div class="section08">
   <h2 id="histobservations">Historical Information on Previous Typhoons</h2>

   <div class="box b0101 bhistory">
    <p>This table gives information on previous destructive typhoons that crossed the Philippines</p>
    <table>
	 <caption align="bottom">
	  Source: Typhoon2000 ; NDCC
	 </caption>
	 <colgroup>
	  <col id="typhoon"/>
	  <col id="class"/>

	  <col id="wind"/>
	  <col id="pressure"/>
	  <col id="rain"/>
	  <col id="impact"/>
	 </colgroup>
	 <thead>
	  <tr>
	   <th scope="col">Typhoon</th>

	   <th scope="col">Classification</th>
	   <th scope="col">Maximum Wind Speed (kph)</th>
	   <th scope="col">Pressure (mbar)</th>
	   <th scope="col">Rainfall (mm)</th>
	   <th scope="col">Potential Impacts</th>
	  </tr>

	 </thead>
	 <tbody>
	  <tr>
	   <td>Basyang (2010)</td>
	   <td>Tropical Depression</td>
	   <td>130</td>
	   <td>970</td>

	   <td>200</td>
	   <td>Cagayan, Isabela, Aurora, Camarines Sur, Camarines, Norte, NCR, Calabarzon, Zambales, Pampanga</td>
	  </tr>
	  <tr>
	   <td>Ondoy (2009)</td>
	   <td>Tropical Storm</td>
	   <td>110</td>

	   <td>980</td>
	   <td>455</td>
	   <td></td>
	  </tr>
	  <tr>
	   <td>Frank (2008)</td>
	   <td>Typhoon</td>

	   <td>160</td>
	   <td>958</td>
	   <td></td>
	   <td></td>
	  </tr>
	  <tr>
	   <td>Reming (2006)</td>

	   <td>Typhoon</td>
	   <td>250</td>
	   <td>904</td>
	   <td></td>
	   <td></td>
	  </tr>
	  <tr>

	   <td>Milenyo (2006)</td>
	   <td>Typhoon</td>
	   <td>230</td>
	   <td>916</td>
	   <td></td>
	   <td></td>
	  </tr>

	 </tbody>
	</table>
   </div>
  </div>
  <p class="disclaimer">Disclaimer: The information displayed here is based on the latest data received by the Manila Observatory from our partners. Manila Observatory provides this information for research purposes, and is not responsible for its ultimate use by viewers.  Concerned viewers should check and confirm the information presented here with official sources.</p>
  </div>
 </body>
</html>
