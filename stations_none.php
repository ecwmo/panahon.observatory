<!DOCTYPE html>
<html>
<head>
  <title>Observation Stations - Weather Watch Initiative (Manila Observatory)</title>
  <meta name="description" content="Local Philippine weather as processed by the Manila Observatory"/>
  <meta charset="UTF-8"/>
  <link href="./wwi-styles/default.css" rel="stylesheet" type="text/css"/>
  <script src="./wwi-scripts/stations.js" type="text/javascript"></script>
</head>
<body>
<div class="root">
  <div class="header">
    <img alt="Manila Observatory Logo" class="left" src="./wwi-images/logo.png"/>
    <div class="left">
      <h1>Manila Observatory</h1>
      <p>Ateneo de Manila University Campus</p>
      <p>Loyola Heights, Quezon City, Philippines</p>
    </div>
    <div class="left head-contact">
      <p>Tel: (632) 426-5921 / 426-0837 / 426-6495</p>
      <p>Fax: (632) 426-0847 / 426-6141</p>
      <p>Email: <a href="#" title="Manila Observatory email address">manila@observatory.ph</a></p>
    </div>
  </div>
  <div class="nav">
    <ul>
      <li><a href="./index.php" title="Observation Stations - Graphs and Information">Quick View</a></li>
      <li class="active">Stations</li>
      <li><a href="./models.php" title="Model Results - Forecasts and Maps">Models</a></li>
      <li><a href="./satellites.php" title="Remote Sensing - Satellite Images">Satellites</a></li>
      <li><a href="./climate.php" title="Philippine Climate Information">Climate</a></li>
      <li><a href="./reports.php" title="Manila Observatory Reports Archive">Reports</a></li>
    </ul>
    <a class="right" href="faq.html" title="Frequently Asked Questions">FAQ</a>
  </div>
  <div class="selectors">
    <div class="st-options">
      <table class="left" id="mm">
        <tr>
          <th><span class="region-group" onmousedown="stselect('mm')">Metro Manila</span></th>
        </tr>
        <tr>
          <td>
            <ul>
              <li><span class="group">Caloocan</span></li>
              <li><a href="#ca-ky" title="Kaybiga, Caloocan">Kaybiga</a></li>
              <li><a href="#ca-up" title="U Plata, Caloocan">U. Plata (Caltex)</a></li>
            </ul>
            <ul>
              <li><span class="group">Las Pinas</span></li>
              <li><a href="#lp-pa" title="Pamplona, Las Pinas">Pamplona (Caltex)</a></li>
              <li><a href="#lp-sl" title="Southland, Las Pinas">Southland, Talon Uno</a></li>
            </ul>
            <ul>
              <li><span class="group">Makati</span></li>
              <li><a href="#mk-fp" title="Brgy Forbes Park, Makati City">Forbes Park (Brgy.)</a></li>
              <li><a href="#mk-gd" title="Guadalupe, Makati City">Guadalupe</a></li>
              <li><a href="#mk-ch" title="Makati City Hall, Makati City">Makati City Hall</a></li>
              <li><a href="#mk-pb" title="Brgy Pembo, Makati City">Pembo (Brgy.)</a></li>
              <li><a href="#mk-pi" title="Brgy Pinagkaisahan, Makati City">Pinagkaisahan (Brgy.)</a></li>
              <li><a href="#mk-sa" title="Brgy San Antonio, Makati City">San Antonio (Brgy.)</a></li>
              <li><a href="#mk-sl" title="Brgy San Lorenzo, Makati City">San Lorenzo (Brgy.)</a></li>
              <li><a href="#mk-wr" title="Brgy West Rembo, Makati City">West Rembo (Brgy.)</a></li>
            </ul>
          </td>
          <td rowspan="2">
            <ul>
              <li><span class="group">Manila</span></li>
              <li><a href="#mn-qa" title="Quirino Avenue, Manila">Quirino Avenue (Caltex)</a></li>
              <li><a href="#ty-gf" title="Gov Forbes, Tayuman">Tayuman (Caltex)</a></li>
            </ul>
            <ul>
              <li><span class="group">Marikina</span></li>
              <li><a href="#mr-ng" title="Nangka, Marikina City">Nangka</a></li>
            </ul>
            <ul>
              <li><span class="group">Navotas</span></li>
              <li><a href="#nv-nv" title="Navotas">Navotas City (Caltex)</a></li>
            </ul>
            <ul>
              <li><span class="group">Paranaque</span></li>
              <li><a href="#pq-kb" title="Kabihasnan, Paranaque">Kabihasnan (Caltex)</a></li>
              <li><a href="#pq-si" title="San Isidro, Paranaque">San Isidro (Caltex)</a></li>
            </ul>
            <ul>
              <li><span class="group">Pasay</span></li>
              <li><a href="#pa-mv" title="Merville, Pasay City">Merville (Caltex)</a></li>
            </ul>
          </td>
          <td rowspan="2">
            <ul>
              <li><span class="group">Pasig</span></li>
              <li><a href="#pg-dp" title="Brgy dela Paz, Pasig City">dela Paz (Brgy.)</a></li>
              <li><a href="#pg-mf" title="Manggahan Floodway, Pasig City">Manggahan Floodway (Caltex)</a></li>
            </ul>
            <ul>
              <li><span class="group">Quezon City</span></li>
              <li><a href="#qc-mo" title="Manila Observatory, Quezon City">Ateneo de Manila</a></li>
              <li><a href="#qc-hs" title="Brgy Holy Spirit, Quezon City">Holy Spirit (Caltex)</a></li>
              <li><a href="#qc-km" title="Brgy Kamuning, Quezon City">Kamuning (Caltex)</a></li>
              <li><a href="#qc-mn" title="Mindanao Avenue, Quezon City">Mindanao Avenue (Caltex)</a></li>
              <li><a href="#qc-py" title="Brgy Payatas B, Quezon City">Payatas B (Brgy.)</a></li>
            </ul>
            <ul>
              <li><span class="group">San Juan</span></li>
              <li><a href="#sj-fb" title="F Blumentrit, San Juan">F. Blumentrit (Caltex)</a></li>
            </ul>
            <ul>
              <li><span class="group">Valenzuela</span></li>
              <li><a href="#va-ma" title="Malinta, Valenzuela">Malinta (Malinta)</a></li>
            </ul>
          </td>
        </tr>
      </table>
      <table class="left" id="rz">
        <tr>
          <th><span class="region-group" onmousedown="stselect('rz')">Rizal</span></th>
        </tr>
        <tr>
          <td>
            <ul>
              <li><span class="group">Angono</span></li>
              <li><a href="#ag-sv" title="Brgy San Vicente, Angono">San Vicente (Brgy.)</a></li>
            </ul>
            <ul>
              <li><span class="group">Antipolo</span></li>
              <li><a href="#at-sl" title="Brgy San Luis, Antipolo">San Luis (Brgy.)</a></li>
              <li><a href="#at-sr" title="Brgy San Roque, Antipolo">San Roque (Brgy.)</a></li>
              <li><a href="#at-sa" title="Sumulong Avenue, Antipolo">Sumulong Avenue (Caltex)</a></li>
            </ul>
            <ul>
              <li><span class="group">Pililla</span></li>
              <li><a href="#pi-ma" title="Brgy Malaya, Pililla">Malaya (Brgy.)</a></li>
            </ul>
            <ul>
              <li><span class="group">Rodriguez</span></li>
                <li><a href="#rd-sj" title="Brgy San Jose, Rodriguez">San Jose (Brgy.)</a></li>
            </ul>
            <ul>
              <li>San Mateo</li>
                <li><a href="#sm-am" title="Brgy Ampid, San Mateo">Ampid (Brgy.)</a></li>
            </ul>
            <ul>
              <li><span class="group">Taytay</span></li>
              <li><a href="#tt-tp" title="Tapayan Pumping Station, Taytay">Tapayan Pumping Station</a></li>
            </ul>
          </td>
        </tr>
      </table>
      <table class="left" id="mn">
        <tr>
          <th>Cavite</th>
        </tr>
        <tr>
          <td>
            <ul>
              <li>Cavite City</li>
              <li><a href="#cv-cc" title="Corregidor Island, Cavite City">Corregidor Island</a></li>
            </ul>
          </td>
        </tr>
        <tr>
          <th><span class="region-group" onmousedown="stselect('mn')">Mindanao</span></th>
        </tr>
        <tr>
          <td>
            <ul>
              <li><span class="group">Bukidnon</span></li>
              <li><a href="#bk-da" title="Dahilayan Adventure Park, Bukidnon">Dahilayan</a></li>
            </ul>
            <ul>
              <li><span class="group">Cagayan de Oro</span></li>
              <li><a href="#co-xu" title="Xavier University, Cagayan de Oro">Xavier University</a></li>
            </ul>
            <ul>
              <li><span class="group">Davao City</span></li>
              <li><a href="#dc-mo" title="Matina Hills, Davao City">Matina Hills</a></li>
            </ul>
            <ul>
              <li><span class="group">Koronadal</span></li>
              <li><a href="#kr-nm" title="Notre Dame of Marbel, Koronadal">Notre Dame of Marbel</a></li>
            </ul>
            <ul>
              <li><span class="group">Zamboanga City</span></li>
              <li><a href="#zc-az" title="Ateneo de Zamboanga, Zamboanga City">Ateneo de Zamboanga</a></li>
            </ul>
          </td>
        </tr>
      </table>
            <form class="left st-picks">
             <input checked="checked" id="allstations" onmouseup="stselect('all',this)" type="checkbox">All Stations</br></br>
             <input checked="checked" onmousedown="pargraph('strain',this)" type="checkbox">Rainfall</br>
             <input onmousedown="pargraph('sttemp',this)" type="checkbox">Temperature</br>
             <input onmousedown="pargraph('stwind',this)" type="checkbox">Wind</br>
             <input onmousedown="pargraph('stsolar',this)" type="checkbox">Solar Radiation</br>
             <input onmousedown="pargraph('stbp',this)" type="checkbox">Air Pressure</br>
            </form>
    </div>
  </div>
  <div class="stations">

    <div id="ca-ky">
      <h4>Kaybiga, Caloocan City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Kaybiga, Caloocan City" id="ca-kystrain" src="./wwi-data/graphs/day/mw012/rain.png"/>
      <img alt="Temperature time series for Kaybiga, Caloocan City" id="ca-kysttemp" src="./wwi-data/graphs/day/mw012/temp.png"/>
      <img alt="Wind time series for Kaybiga, Caloocan City" id="ca-kystwind" src="./wwi-data/graphs/day/mw012/ws.png"/>
      <img alt="Solar Radiation time series for Kaybiga, Caloocan City" id="ca-kystsolar" src="./wwi-data/graphs/day/mw012/solar.png"/>
      <img alt="Barometric Pressure time series for Kaybiga, Caloocan City" id="ca-kystbp" src="./wwi-data/graphs/day/mw012/bp.png"/>
    </div>
    <div id="ca-up">
      <h4>U. Plata, Caloocan City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for U. Plata, Caloocan City" id="ca-upstrain" src="./wwi-data/graphs/day/mw007/rain.png"/>
      <img alt="Temperature time series for U. Plata, Caloocan City" id="ca-upsttemp" src="./wwi-data/graphs/day/mw007/temp.png"/>
      <img alt="Wind time series for U. Plata, Caloocan City" id="ca-upstwind" src="./wwi-data/graphs/day/mw007/ws.png"/>
      <img alt="Solar Radiation time series for U. Plata, Caloocan City" id="ca-upstsolar" src="./wwi-data/graphs/day/mw007/solar.png"/>
      <img alt="Barometric Pressure time series for U. Plata, Caloocan City" id="ca-upstbp" src="./wwi-data/graphs/day/mw007/bp.png"/>
    </div>
    <div id="lp-pa">
      <h4>Pamplona, Las Pinas City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Pamplona, Las Pinas City" id="lp-pastrain" src="./wwi-data/graphs/day/mw014/rain.png"/>
      <img alt="Temperature time series for Pamplona, Las Pinas City" id="lp-pasttemp" src="./wwi-data/graphs/day/mw014/temp.png"/>
      <img alt="Wind time series for Pamplona, Las Pinas City" id="lp-pastwind" src="./wwi-data/graphs/day/mw014/ws.png"/>
      <img alt="Solar Radiation time series for Pamplona, Las Pinas City" id="lp-pastsolar" src="./wwi-data/graphs/day/mw014/solar.png"/>
      <img alt="Barometric Pressure time series for Pamplona, Las Pinas City" id="lp-pastbp" src="./wwi-data/graphs/day/mw014/bp.png"/>
    </div>
    <div id="mk-fp">
      <h4>Brgy. Forbes Park, Makati City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. Forbes Park, Makati City" id="mk-fpstrain" src="./wwi-data/graphs/day/makati05/rain.png"/>
      <img alt="Temperature time series for Brgy. Forbes Park, Makati City" id="mk-fpsttemp" src="./wwi-data/graphs/day/makati05/temp.png"/>
      <img alt="Wind time series for Brgy. Forbes Park, Makati City" id="mk-fpstwind" src="./wwi-data/graphs/day/makati05/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. Forbes Park, Makati City" id="mk-fpstsolar" src="./wwi-data/graphs/day/makati05/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. Forbes Park, Makati City" id="mk-fpstbp" src="./wwi-data/graphs/day/makati05/bp.png"/>
    </div>
    <div id="mk-gd">
      <h4>Guadalupe, Makati City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Guadalupe, Makati City" id="mk-gdstrain" src="./wwi-data/graphs/day/mo004/rain.png"/>
      <img alt="Temperature time series for Guadalupe, Makati City" id="mk-gdsttemp" src="./wwi-data/graphs/day/mo004/temp.png"/>
      <img alt="Wind time series for Guadalupe, Makati City" id="mk-gdstwind" src="./wwi-data/graphs/day/mo004/ws.png"/>
      <img alt="Solar Radiation time series for Guadalupe, Makati City" id="mk-gdstsolar" src="./wwi-data/graphs/day/mo004/solar.png"/>
      <img alt="Barometric Pressure time series for Guadalupe, Makati City" id="mk-gdstbp" src="./wwi-data/graphs/day/mo004/bp.png"/>
    </div>
    <div id="mk-ch">
      <h4>Makati City Hall, Makati City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Makati City Hall, Makati City" id="mk-chstrain" src="./wwi-data/graphs/day/makati02/rain.png"/>
      <img alt="Temperature time series for Makati City Hall, Makati City" id="mk-chsttemp" src="./wwi-data/graphs/day/makati02/temp.png"/>
      <img alt="Wind time series for Makati City Hall, Makati City" id="mk-chstwind" src="./wwi-data/graphs/day/makati02/ws.png"/>
      <img alt="Solar Radiation time series for Makati City Hall, Makati City" id="mk-chstsolar" src="./wwi-data/graphs/day/makati02/solar.png"/>
      <img alt="Barometric Pressure time series for Makati City Hall, Makati City" id="mk-chstbp" src="./wwi-data/graphs/day/makati02/bp.png"/>
    </div>
    <div id="mk-pb">
      <h4>Brgy. Pembo, Makati City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. Pembo, Makati City" id="mk-pbstrain" src="./wwi-data/graphs/day/makati06/rain.png"/>
      <img alt="Temperature time series for Brgy. Pembo, Makati City" id="mk-pbsttemp" src="./wwi-data/graphs/day/makati06/temp.png"/>
      <img alt="Wind time series for Brgy. Pembo, Makati City" id="mk-pbstwind" src="./wwi-data/graphs/day/makati06/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. Pembo, Makati City" id="mk-pbstsolar" src="./wwi-data/graphs/day/makati06/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. Pembo, Makati City" id="mk-pbstbp" src="./wwi-data/graphs/day/makati06/bp.png"/>
    </div>
    <div id="mk-pi">
      <h4>Brgy. Pinagkaisahan, Makati City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. Pinagkaisahan, Makati City" id="mk-pistrain" src="./wwi-data/graphs/day/makati07/rain.png"/>
      <img alt="Temperature time series for Brgy. Pinagkaisahan, Makati City" id="mk-pisttemp" src="./wwi-data/graphs/day/makati07/temp.png"/>
      <img alt="Wind time series for Brgy. Pinagkaisahan, Makati City" id="mk-pistwind" src="./wwi-data/graphs/day/makati07/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. Pinagkaisahan, Makati City" id="mk-pistsolar" src="./wwi-data/graphs/day/makati07/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. Pinagkaisahan, Makati City" id="mk-pistbp" src="./wwi-data/graphs/day/makati07/bp.png"/>
    </div>
    <div id="mk-sa">
      <h4>Brgy. San Antonio, Makati City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. San Antonio, Makati City" id="mk-sastrain" src="./wwi-data/graphs/day/makati03/rain.png"/>
      <img alt="Temperature time series for Brgy. San Antonio, Makati City" id="mk-sasttemp" src="./wwi-data/graphs/day/makati03/temp.png"/>
      <img alt="Wind time series for Brgy. San Antonio, Makati City" id="mk-sastwind" src="./wwi-data/graphs/day/makati03/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. San Antonio, Makati City" id="mk-sastsolar" src="./wwi-data/graphs/day/makati03/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. San Antonio, Makati City" id="mk-sastbp" src="./wwi-data/graphs/day/makati03/bp.png"/>
    </div>
    <div id="mk-sl">
      <h4>Brgy. San Lorenzo, Makati City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. San Lorenzo, Makati City" id="mk-slstrain" src="./wwi-data/graphs/day/makati01/rain.png"/>
      <img alt="Temperature time series for Brgy. San Lorenzo, Makati City" id="mk-slsttemp" src="./wwi-data/graphs/day/makati01/temp.png"/>
      <img alt="Wind time series for Brgy. San Lorenzo, Makati City" id="mk-slstwind" src="./wwi-data/graphs/day/makati01/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. San Lorenzo, Makati City" id="mk-slstsolar" src="./wwi-data/graphs/day/makati01/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. San Lorenzo, Makati City" id="mk-slstbp" src="./wwi-data/graphs/day/makati01/bp.png"/>
    </div>
    <div id="mk-wr">
      <h4>Brgy. West Rembo, Makati City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. West Rembo, Makati City" id="mk-wrstrain" src="./wwi-data/graphs/day/makati04/rain.png"/>
      <img alt="Temperature time series for Brgy. West Rembo, Makati City" id="mk-wrsttemp" src="./wwi-data/graphs/day/makati04/temp.png"/>
      <img alt="Wind time series for Brgy. West Rembo, Makati City" id="mk-wrstwind" src="./wwi-data/graphs/day/makati04/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. West Rembo, Makati City" id="mk-wrstsolar" src="./wwi-data/graphs/day/makati04/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. West Rembo, Makati City" id="mk-wrstbp" src="./wwi-data/graphs/day/makati04/bp.png"/>
    </div>
    <div id="mn-qa">
      <h4>Quirino Avenue, Manila</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Quirino Avenue, Manila" id="mn-qastrain" src="./wwi-data/graphs/day/mw017/rain.png"/>
      <img alt="Temperature time series for Quirino Avenue, Manila" id="mn-qasttemp" src="./wwi-data/graphs/day/mw017/temp.png"/>
      <img alt="Wind time series for Quirino Avenue, Manila" id="mn-qastwind" src="./wwi-data/graphs/day/mw017/ws.png"/>
      <img alt="Solar Radiation time series for Quirino Avenue, Manila" id="mn-qastsolar" src="./wwi-data/graphs/day/mw017/solar.png"/>
      <img alt="Barometric Pressure time series for Quirino Avenue, Manila" id="mn-qastbp" src="./wwi-data/graphs/day/mw017/bp.png"/>
    </div>
    <div id="mr-ng">
      <h4>Nangka, Marikina City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Nangka, Marikina City" id="mr-ngstrain" src="./wwi-data/graphs/day/mo001/rain.png"/>
      <img alt="Temperature time series for Nangka, Marikina City" id="mr-ngsttemp" src="./wwi-data/graphs/day/mo001/temp.png"/>
      <img alt="Wind time series for Nangka, Marikina City" id="mr-ngstwind" src="./wwi-data/graphs/day/mo001/ws.png"/>
      <img alt="Solar Radiation time series for Nangka, Marikina City" id="mr-ngstsolar" src="./wwi-data/graphs/day/mo001/solar.png"/>
      <img alt="Barometric Pressure time series for Nangka, Marikina City" id="mr-ngstbp" src="./wwi-data/graphs/day/mo001/bp.png"/>
    </div>
    <div id="nv-nv">
      <h4>Navotas, Navotas City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Navotas, Navotas City" id="nv-nvstrain" src="./wwi-data/graphs/day/mw008/rain.png"/>
      <img alt="Temperature time series for Navotas, Navotas City" id="nv-nvsttemp" src="./wwi-data/graphs/day/mw008/temp.png"/>
      <img alt="Wind time series for Navotas, Navotas City" id="nv-nvstwind" src="./wwi-data/graphs/day/mw008/ws.png"/>
      <img alt="Solar Radiation time series for Navotas, Navotas City" id="nv-nvstsolar" src="./wwi-data/graphs/day/mw008/solar.png"/>
      <img alt="Barometric Pressure time series for Navotas, Navotas City" id="nv-nvstbp" src="./wwi-data/graphs/day/mw008/bp.png"/>
    </div>
    <div id="pq-kb">
      <h4>Kabihasnan, Paranaque</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Kabihasnan, Paranaque" id="pq-kbstrain" src="./wwi-data/graphs/day/mw013/rain.png"/>
      <img alt="Temperature time series for Kabihasnan, Paranaque" id="pq-kbsttemp" src="./wwi-data/graphs/day/mw013/temp.png"/>
      <img alt="Wind time series for Kabihasnan, Paranaque" id="pq-kbstwind" src="./wwi-data/graphs/day/mw013/ws.png"/>
      <img alt="Solar Radiation time series for Kabihasnan, Paranaque" id="pq-kbstsolar" src="./wwi-data/graphs/day/mw013/solar.png"/>
      <img alt="Barometric Pressure time series for Kabihasnan, Paranaque" id="pq-kbstbp" src="./wwi-data/graphs/day/mw013/bp.png"/>
    </div>
    <div id="pq-si">
      <h4>San Isidro, Sucat, Paranaque</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for San Isidro, Sucat, Paranaque" id="pq-sistrain" src="./wwi-data/graphs/day/mw015/rain.png"/>
      <img alt="Temperature time series for San Isidro, Sucat, Paranaque" id="pq-sisttemp" src="./wwi-data/graphs/day/mw015/temp.png"/>
      <img alt="Wind time series for San Isidro, Sucat, Paranaque" id="pq-sistwind" src="./wwi-data/graphs/day/mw015/ws.png"/>
      <img alt="Solar Radiation time series for San Isidro, Sucat, Paranaque" id="pq-sistsolar" src="./wwi-data/graphs/day/mw015/solar.png"/>
      <img alt="Barometric Pressure time series for San Isidro, Sucat, Paranaque" id="pq-sistbp" src="./wwi-data/graphs/day/mw015/bp.png"/>
    </div>
    <div id="pa-mv">
      <h4>Merville, Pasay City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Merville, Pasay City" id="pa-mvstrain" src="./wwi-data/graphs/day/mw016/rain.png"/>
      <img alt="Temperature time series for Merville, Pasay City" id="pa-mvsttemp" src="./wwi-data/graphs/day/mw016/temp.png"/>
      <img alt="Wind time series for Merville, Pasay City" id="pa-mvstwind" src="./wwi-data/graphs/day/mw016/ws.png"/>
      <img alt="Solar Radiation time series for Merville, Pasay City" id="pa-mvstsolar" src="./wwi-data/graphs/day/mw016/solar.png"/>
      <img alt="Barometric Pressure time series for Merville, Pasay City" id="pa-mvstbp" src="./wwi-data/graphs/day/mw016/bp.png"/>
    </div>
    <div id="pg-dp">
      <h4>Brgy. dela Paz, Pasig City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. dela Paz, Pasig City" id="pg-dpstrain" src="./wwi-data/graphs/day/mw028/rain.png"/>
      <img alt="Temperature time series for Brgy. dela Paz, Pasig City" id="pg-dpsttemp" src="./wwi-data/graphs/day/mw028/temp.png"/>
      <img alt="Wind time series for Brgy. dela Paz, Pasig City" id="pg-dpstwind" src="./wwi-data/graphs/day/mw028/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. dela Paz, Pasig City" id="pg-dpstsolar" src="./wwi-data/graphs/day/mw028/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. dela Paz, Pasig City" id="pg-dpstbp" src="./wwi-data/graphs/day/mw028/bp.png"/>
    </div>
    <div id="pg-mf">
      <h4>Manggahan Floodway, Pasig City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Manggahan Floodway, Pasig City" id="pg-mfstrain" src="./wwi-data/graphs/day/mw006/rain.png"/>
      <img alt="Temperature time series for Manggahan Floodway, Pasig City" id="pg-mfsttemp" src="./wwi-data/graphs/day/mw006/temp.png"/>
      <img alt="Wind time series for Manggahan Floodway, Pasig City" id="pg-mfstwind" src="./wwi-data/graphs/day/mw006/ws.png"/>
      <img alt="Solar Radiation time series for Manggahan Floodway, Pasig City" id="pg-mfstsolar" src="./wwi-data/graphs/day/mw006/solar.png"/>
      <img alt="Barometric Pressure time series for Manggahan Floodway, Pasig City" id="pg-mfstbp" src="./wwi-data/graphs/day/mw006/bp.png"/>
    </div>
    <div id="qc-mo">
      <h4>Loyola Heights, Quezon City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Loyola Heights, Quezon City" id="qc-mostrain" src="./wwi-data/graphs/day/MOIP/rain.png"/>
      <img alt="Temperature time series for Loyola Heights, Quezon City" id="qc-mosttemp" src="./wwi-data/graphs/day/MOIP/temp.png"/>
      <img alt="Wind time series for Loyola Heights, Quezon City" id="qc-mostwind" src="./wwi-data/graphs/day/MOIP/ws.png"/>
      <img alt="Solar Radiation time series for Loyola Heights, Quezon City" id="qc-mostsolar" src="./wwi-data/graphs/day/MOIP/solar.png"/>
      <img alt="Barometric Pressure time series for Loyola Heights, Quezon City" id="qc-mostbp" src="./wwi-data/graphs/day/MOIP/bp.png"/>
    </div>
    <div id="lp-sl">
      <h4>Southland, Talon Uno, Las Pinas City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Southland, Talon Uno, Las Pinas City" id="lp-slstrain" src="./wwi-data/graphs/day/mw001/rain.png"/>
      <img alt="Temperature time series for Southland, Talon Uno, Las Pinas City" id="lp-slsttemp" src="./wwi-data/graphs/day/mw001/temp.png"/>
      <img alt="Wind time series for Southland, Talon Uno, Las Pinas City" id="lp-slstwind" src="./wwi-data/graphs/day/mw001/ws.png"/>
      <img alt="Solar Radiation time series for Southland, Talon Uno, Las Pinas City" id="lp-slstsolar" src="./wwi-data/graphs/day/mw001/solar.png"/>
      <img alt="Barometric Pressure time series for Southland, Talon Uno, Las Pinas City" id="lp-slstbp" src="./wwi-data/graphs/day/mw001/bp.png"/>
    </div>
    <div id="qc-hs">
      <h4>Brgy. Holy Spirit, Quezon City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. Holy Spirit, Quezon City" id="qc-hsstrain" src="./wwi-data/graphs/day/mw002/rain.png"/>
      <img alt="Temperature time series for Brgy. Holy Spirit, Quezon City" id="qc-hssttemp" src="./wwi-data/graphs/day/mw002/temp.png"/>
      <img alt="Wind time series for Brgy. Holy Spirit, Quezon City" id="qc-hsstwind" src="./wwi-data/graphs/day/mw002/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. Holy Spirit, Quezon City" id="qc-hsstsolar" src="./wwi-data/graphs/day/mw002/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. Holy Spirit, Quezon City" id="qc-hsstbp" src="./wwi-data/graphs/day/mw002/bp.png"/>
    </div>
    <div id="qc-km">
      <h4>Brgy. Kamuning, Quezon City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. Kamuning, Quezon City" id="qc-kmstrain" src="./wwi-data/graphs/day/mw003/rain.png"/>
      <img alt="Temperature time series for Brgy. Kamuning, Quezon City" id="qc-kmsttemp" src="./wwi-data/graphs/day/mw003/temp.png"/>
      <img alt="Wind time series for Brgy. Kamuning, Quezon City" id="qc-kmstwind" src="./wwi-data/graphs/day/mw003/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. Kamuning, Quezon City" id="qc-kmstsolar" src="./wwi-data/graphs/day/mw003/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. Kamuning, Quezon City" id="qc-kmstbp" src="./wwi-data/graphs/day/mw003/bp.png"/>
    </div>
    <div id="qc-mn">
      <h4>Brgy. Mindanao Avenue, Quezon City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. Mindanao Avenue, Quezon City" id="qc-mnstrain" src="./wwi-data/graphs/day/mw004/rain.png"/>
      <img alt="Temperature time series for Brgy. Mindanao Avenue, Quezon City" id="qc-mnsttemp" src="./wwi-data/graphs/day/mw004/temp.png"/>
      <img alt="Wind time series for Brgy. Mindanao Avenue, Quezon City" id="qc-mnstwind" src="./wwi-data/graphs/day/mw004/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. Mindanao Avenue, Quezon City" id="qc-mnstsolar" src="./wwi-data/graphs/day/mw004/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. Mindanao Avenue, Quezon City" id="qc-mnstbp" src="./wwi-data/graphs/day/mw004/bp.png"/>
    </div>
    <div id="qc-py">
      <h4>Brgy. Payatas B, Quezon City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. Payatas B, Quezon City" id="qc-pystrain" src="./wwi-data/graphs/day/mw018/rain.png"/>
      <img alt="Temperature time series for Brgy. Payatas B, Quezon City" id="qc-pysttemp" src="./wwi-data/graphs/day/mw018/temp.png"/>
      <img alt="Wind time series for Brgy. Payatas B, Quezon City" id="qc-pystwind" src="./wwi-data/graphs/day/mw018/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. Payatas B, Quezon City" id="qc-pystsolar" src="./wwi-data/graphs/day/mw018/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. Payatas B, Quezon City" id="qc-pystbp" src="./wwi-data/graphs/day/mw018/bp.png"/>
    </div>
    <div id="sj-fb">
      <h4>F. Blumentrit, San Juan</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for F. Blumentrit, San Juan" id="sj-fbstrain" src="./wwi-data/graphs/day/mw011/rain.png"/>
      <img alt="Temperature time series for F. Blumentrit, San Juan" id="sj-fbsttemp" src="./wwi-data/graphs/day/mw011/temp.png"/>
      <img alt="Wind time series for F. Blumentrit, San Juan" id="sj-fbstwind" src="./wwi-data/graphs/day/mw011/ws.png"/>
      <img alt="Solar Radiation time series for F. Blumentrit, San Juan" id="sj-fbstsolar" src="./wwi-data/graphs/day/mw011/solar.png"/>
      <img alt="Barometric Pressure time series for F. Blumentrit, San Juan" id="sj-fbstbp" src="./wwi-data/graphs/day/mw011/bp.png"/>
    </div>
    <div id="ty-gf">
      <h4>Gov. Frobes, Tayuman</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Gov. Frobes, Tayuman" id="ty-gfstrain" src="./wwi-data/graphs/day/mw010/rain.png"/>
      <img alt="Temperature time series for Gov. Frobes, Tayuman" id="ty-gfsttemp" src="./wwi-data/graphs/day/mw010/temp.png"/>
      <img alt="Wind time series for Gov. Frobes, Tayuman" id="ty-gfstwind" src="./wwi-data/graphs/day/mw010/ws.png"/>
      <img alt="Solar Radiation time series for Gov. Frobes, Tayuman" id="ty-gfstsolar" src="./wwi-data/graphs/day/mw010/solar.png"/>
      <img alt="Barometric Pressure time series for Gov. Frobes, Tayuman" id="ty-gfstbp" src="./wwi-data/graphs/day/mw010/bp.png"/>
    </div>
    <div id="va-ma">
      <h4>Malinta, Valenzuela</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Malinta, Valenzuela" id="va-mastrain" src="./wwi-data/graphs/day/mw009/rain.png"/>
      <img alt="Temperature time series for Malinta, Valenzuela" id="va-masttemp" src="./wwi-data/graphs/day/mw009/temp.png"/>
      <img alt="Wind time series for Malinta, Valenzuela" id="va-mastwind" src="./wwi-data/graphs/day/mw009/ws.png"/>
      <img alt="Solar Radiation time series for Malinta, Valenzuela" id="va-mastsolar" src="./wwi-data/graphs/day/mw009/solar.png"/>
      <img alt="Barometric Pressure time series for Malinta, Valenzuela" id="va-mastbp" src="./wwi-data/graphs/day/mw009/bp.png"/>
    </div>
    <div id="ag-sv">
      <h4>Brgy. San Vicente, Angono, Rizal</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. San Vicente, Angono, Rizal" id="ag-svstrain" src="./wwi-data/graphs/day/mw024/rain.png"/>
      <img alt="Temperature time series for Brgy. San Vicente, Angono, Rizal" id="ag-svsttemp" src="./wwi-data/graphs/day/mw024/temp.png"/>
      <img alt="Wind time series for Brgy. San Vicente, Angono, Rizal" id="ag-svstwind" src="./wwi-data/graphs/day/mw024/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. San Vicente, Angono, Rizal" id="ag-svstsolar" src="./wwi-data/graphs/day/mw024/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. San Vicente, Angono, Rizal" id="ag-svstbp" src="./wwi-data/graphs/day/mw024/bp.png"/>
    </div>
    <div id="at-sl">
      <h4>Brgy. San Luis, Antipolo, Rizal</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. San Luis, Antipolo, Rizal" id="at-slstrain" src="./wwi-data/graphs/day/mw027/rain.png"/>
      <img alt="Temperature time series for Brgy. San Luis, Antipolo, Rizal" id="at-slsttemp" src="./wwi-data/graphs/day/mw027/temp.png"/>
      <img alt="Wind time series for Brgy. San Luis, Antipolo, Rizal" id="at-slstwind" src="./wwi-data/graphs/day/mw027/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. San Luis, Antipolo, Rizal" id="at-slstsolar" src="./wwi-data/graphs/day/mw027/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. San Luis, Antipolo, Rizal" id="at-slstbp" src="./wwi-data/graphs/day/mw027/bp.png"/>
    </div>
    <div id="at-sr">
      <h4>Brgy. San Roque, Antipolo City, Rizal</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. San Roque, Antipolo City, Rizal" id="at-srstrain" src="./wwi-data/graphs/day/mw021/rain.png"/>
      <img alt="Temperature time series for Brgy. San Roque, Antipolo City, Rizal" id="at-srsttemp" src="./wwi-data/graphs/day/mw021/temp.png"/>
      <img alt="Wind time series for Brgy. San Roque, Antipolo City, Rizal" id="at-srstwind" src="./wwi-data/graphs/day/mw021/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. San Roque, Antipolo City, Rizal" id="at-srstsolar" src="./wwi-data/graphs/day/mw021/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. San Roque, Antipolo City, Rizal" id="at-srstbp" src="./wwi-data/graphs/day/mw021/bp.png"/>
    </div>
    <div id="at-sa">
      <h4>Brgy. Sumulong Avenue, Antipolo, Rizal</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. Sumulong Avenue, Antipolo, Rizal" id="at-sastrain" src="./wwi-data/graphs/day/mw005/rain.png"/>
      <img alt="Temperature time series for Brgy. Sumulong Avenue, Antipolo, Rizal" id="at-sasttemp" src="./wwi-data/graphs/day/mw005/temp.png"/>
      <img alt="Wind time series for Brgy. Sumulong Avenue, Antipolo, Rizal" id="at-sastwind" src="./wwi-data/graphs/day/mw005/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. Sumulong Avenue, Antipolo, Rizal" id="at-sastsolar" src="./wwi-data/graphs/day/mw005/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. Sumulong Avenue, Antipolo, Rizal" id="at-sastbp" src="./wwi-data/graphs/day/mw005/bp.png"/>
    </div>
    <div id="pi-ma">
      <h4>Brgy. Malaya, Pililla, Rizal</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. Malaya, Pililla, Rizal" id="pi-mastrain" src="./wwi-data/graphs/day/mw023/rain.png"/>
      <img alt="Temperature time series for Brgy. Malaya, Pililla, Rizal" id="pi-masttemp" src="./wwi-data/graphs/day/mw023/temp.png"/>
      <img alt="Wind time series for Brgy. Malaya, Pililla, Rizal" id="pi-mastwind" src="./wwi-data/graphs/day/mw023/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. Malaya, Pililla, Rizal" id="pi-mastsolar" src="./wwi-data/graphs/day/mw023/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. Malaya, Pililla, Rizal" id="pi-mastbp" src="./wwi-data/graphs/day/mw023/bp.png"/>
    </div>
    <div id="rd-sj">
      <h4>Brgy. San Jose, Rodriguez, Rizal</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. San Jose, Rodriguez, Rizal" id="rd-sjstrain" src="./wwi-data/graphs/day/mw019/rain.png"/>
      <img alt="Temperature time series for Brgy. San Jose, Rodriguez, Rizal" id="rd-sjsttemp" src="./wwi-data/graphs/day/mw019/temp.png"/>
      <img alt="Wind time series for Brgy. San Jose, Rodriguez, Rizal" id="rd-sjstwind" src="./wwi-data/graphs/day/mw019/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. San Jose, Rodriguez, Rizal" id="rd-sjstsolar" src="./wwi-data/graphs/day/mw019/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. San Jose, Rodriguez, Rizal" id="rd-sjstbp" src="./wwi-data/graphs/day/mw019/bp.png"/>
    </div>
    <div id="sm-am">
      <h4>Brgy. Ampid, San Mateo, Rizal</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Brgy. Ampid, San Mateo, Rizal" id="sm-amstrain" src="./wwi-data/graphs/day/mw020/rain.png"/>
      <img alt="Temperature time series for Brgy. Ampid, San Mateo, Rizal" id="sm-amsttemp" src="./wwi-data/graphs/day/mw020/temp.png"/>
      <img alt="Wind time series for Brgy. Ampid, San Mateo, Rizal" id="sm-amstwind" src="./wwi-data/graphs/day/mw020/ws.png"/>
      <img alt="Solar Radiation time series for Brgy. Ampid, San Mateo, Rizal" id="sm-amstsolar" src="./wwi-data/graphs/day/mw020/solar.png"/>
      <img alt="Barometric Pressure time series for Brgy. Ampid, San Mateo, Rizal" id="sm-amstbp" src="./wwi-data/graphs/day/mw020/bp.png"/>
    </div>
    <div id="tt-tp">
      <h4>Tapayan Pumping Station, Taytay, Rizal</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Tapayan Pumping Station, Taytay, Rizal" id="tt-tpstrain" src="./wwi-data/graphs/day/mw022/rain.png"/>
      <img alt="Temperature time series for Tapayan Pumping Station, Taytay, Rizal" id="tt-tpsttemp" src="./wwi-data/graphs/day/mw022/temp.png"/>
      <img alt="Wind time series for Tapayan Pumping Station, Taytay, Rizal" id="tt-tpstwind" src="./wwi-data/graphs/day/mw022/ws.png"/>
      <img alt="Solar Radiation time series for Tapayan Pumping Station, Taytay, Rizal" id="tt-tpstsolar" src="./wwi-data/graphs/day/mw022/solar.png"/>
      <img alt="Barometric Pressure time series for Tapayan Pumping Station, Taytay, Rizal" id="tt-tpstbp" src="./wwi-data/graphs/day/mw022/bp.png"/>
    </div>
    <div id="cv-cc">
      <h4>Corregidor Island, Cavite City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Corregidor Island, Cavite City" id="cv-ccstrain" src="./wwi-data/graphs/day/mw026/rain.png"/>
      <img alt="Temperature time series for Corregidor Island, Cavite City" id="cv-ccsttemp" src="./wwi-data/graphs/day/mw026/temp.png"/>
      <img alt="Wind time series for Corregidor Island, Cavite City" id="cv-ccstwind" src="./wwi-data/graphs/day/mw026/ws.png"/>
      <img alt="Solar Radiation time series for Corregidor Island, Cavite City" id="cv-ccstsolar" src="./wwi-data/graphs/day/mw026/solar.png"/>
      <img alt="Barometric Pressure time series for Corregidor Island, Cavite City" id="cv-ccstbp" src="./wwi-data/graphs/day/mw026/bp.png"/>
    </div>
    <div id="bk-da">
      <h4>Dahilayan, Bukidnon</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Dahilayan, Bukidnon" id="bk-dastrain" src="./wwi-data/graphs/day/zipzone/rain.png"/>
      <img alt="Temperature time series for Dahilayan, Bukidnon" id="bk-dasttemp" src="./wwi-data/graphs/day/zipzone/temp.png"/>
      <img alt="Wind time series for Dahilayan, Bukidnon" id="bk-dastwind" src="./wwi-data/graphs/day/zipzone/ws.png"/>
      <img alt="Solar Radiation time series for Dahilayan, Bukidnon" id="bk-dastsolar" src="./wwi-data/graphs/day/zipzone/solar.png"/>
      <img alt="Barometric Pressure time series for Dahilayan, Bukidnon" id="bk-dastbp" src="./wwi-data/graphs/day/zipzone/bp.png"/>
    </div>
    <div id="co-xu">
      <h4>Xavier University, Cagayan de Oro City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Xavier University, Cagayan de Oro City" id="co-xustrain" src="./wwi-data/graphs/day/xuws1/rain.png"/>
      <img alt="Temperature time series for Xavier University, Cagayan de Oro City" id="co-xusttemp" src="./wwi-data/graphs/day/xuws1/temp.png"/>
      <img alt="Wind time series for Xavier University, Cagayan de Oro City" id="co-xustwind" src="./wwi-data/graphs/day/xuws1/ws.png"/>
      <img alt="Solar Radiation time series for Xavier University, Cagayan de Oro City" id="co-xustsolar" src="./wwi-data/graphs/day/xuws1/solar.png"/>
      <img alt="Barometric Pressure time series for Xavier University, Cagayan de Oro City" id="co-xustbp" src="./wwi-data/graphs/day/xuws1/bp.png"/>
    </div>
    <div id="dc-mo">
      <h4>Matina Hills, Davao City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Matina Hills, Davao City" id="dc-mostrain" src="./wwi-data/graphs/day/MOD/rain.png"/>
      <img alt="Temperature time series for Matina Hills, Davao City" id="dc-mosttemp" src="./wwi-data/graphs/day/MOD/temp.png"/>
      <img alt="Wind time series for Matina Hills, Davao City" id="dc-mostwind" src="./wwi-data/graphs/day/MOD/ws.png"/>
      <img alt="Solar Radiation time series for Matina Hills, Davao City" id="dc-mostsolar" src="./wwi-data/graphs/day/MOD/solar.png"/>
      <img alt="Barometric Pressure time series for Matina Hills, Davao City" id="dc-mostbp" src="./wwi-data/graphs/day/MOD/bp.png"/>
    </div>
    <div id="kr-nm">
      <h4>Notre Dame of Marbel University, Koronadal City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Notre Dame of Marbel University, Koronadal City" id="kr-nmstrain" src="./wwi-data/graphs/day/mo003/rain.png"/>
      <img alt="Temperature time series for Notre Dame of Marbel University, Koronadal City" id="kr-nmsttemp" src="./wwi-data/graphs/day/mo003/temp.png"/>
      <img alt="Wind time series for Notre Dame of Marbel University, Koronadal City" id="kr-nmstwind" src="./wwi-data/graphs/day/mo003/ws.png"/>
      <img alt="Solar Radiation time series for Notre Dame of Marbel University, Koronadal City" id="kr-nmstsolar" src="./wwi-data/graphs/day/mo003/solar.png"/>
      <img alt="Barometric Pressure time series for Notre Dame of Marbel University, Koronadal City" id="kr-nmstbp" src="./wwi-data/graphs/day/mo003/bp.png"/>
    </div>
    <div id="zc-az">
      <h4>Ateneo de Zamboanga, Zamboanga City</h4> <a href="#">&uarr; back to top &uarr;</a>
      <img alt="Rainfall time series for Ateneo de Zamboanga, Zamboanga City" id="zc-azstrain" src="./wwi-data/graphs/day/mo002/rain.png"/>
      <img alt="Temperature time series for Ateneo de Zamboanga, Zamboanga City" id="zc-azsttemp" src="./wwi-data/graphs/day/mo002/temp.png"/>
      <img alt="Wind time series for Ateneo de Zamboanga, Zamboanga City" id="zc-azstwind" src="./wwi-data/graphs/day/mo002/ws.png"/>
      <img alt="Solar Radiation time series for Ateneo de Zamboanga, Zamboanga City" id="zc-azstsolar" src="./wwi-data/graphs/day/mo002/solar.png"/>
      <img alt="Barometric Pressure time series for Ateneo de Zamboanga, Zamboanga City" id="zc-azstbp" src="./wwi-data/graphs/day/mo002/bp.png"/>
    </div>
  </div>
</div>
</body>
</html>