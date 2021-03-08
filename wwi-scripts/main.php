<?php

chdir(dirname(__FILE__));
date_default_timezone_set("Asia/Manila");

// <head>
$title  = '  <title>Weather Watch Initiative - Manila Observatory</title>';
$meta   = '  <meta name="description" content="Local Philippine weather as processed by the Manila Observatory"/>'."\n".
          '  <meta charset="UTF-8"/>';
$style  = '  <link href="./wwi-styles/default.css" rel="stylesheet" type="text/css"/>'."\n".
          '  <link id="stations-link" href="./wwi-styles/stations-ph.css" rel="stylesheet" type="text/css"/>'."\n".
          '  <link id="stations-color" href="./wwi-styles/stations-color-rain.css" rel="stylesheet" type="text/css"/>';
$script = '  <script src="./wwi-scripts/main.js" type="text/javascript"></script>';

$head   = '<head>'."\n".$title."\n".$meta."\n".$style."\n".$script."\n".'</head>';
// <body>
$header = '  <div class="header">'."\n".
          '    <img alt="Manila Observatory Logo" class="left" src="./wwi-images/logo.png"/>'."\n".
          '    <div class="left">'."\n".
          '      <h1>Manila Observatory</h1>'."\n".
          '      <p>Ateneo de Manila University Campus</p>'."\n".
          '      <p>Loyola Heights, Quezon City, Philippines</p>'."\n".
          '    </div>'."\n".
          '    <div class="left head-contact">'."\n".
          '      <p>Tel: (632) 426-5921 / 426-0837 / 426-6495</p>'."\n".
          '      <p>Fax: (632) 426-0847 / 426-6141</p>'."\n".
          '      <p>Email: <a href="#" title="Manila Observatory email address">manila@observatory.ph</a></p>'."\n".
          '    </div>'."\n".
          '  </div>';
$navigation = '  <div class="nav">'."\n".
              '    <ul>'."\n".
              '      <li class="active">Quick View</li>'."\n".
              '      <li><a href="./stations.php" title="Observation Stations - Graphs and Information">Stations</a></li>'."\n".
              '      <li><a href="./models.php" title="Model Results - Forecasts and Maps">Models</a></li>'."\n".
              '      <li><a href="./satellites.php" title="Remote Sensing - Satellite Images">Satellites</a></li>'."\n".
              '      <li><a href="./climate.php" title="Philippine Climate Information">Climate</a></li>'."\n".
              '      <li><a href="./reports.php" title="Manila Observatory Reports Archive">Reports</a></li>'."\n".
              '    </ul>'."\n".
              '    <a class="right" href="faq.html" title="Frequently Asked Questions">FAQ</a>'."\n".
              '  </div>';
$selectors = '  <div class="selectors">'."\n".
             '    <div class="choice">'."\n".
             '      <form>'."\n".
             '        Map: <input checked="checked" id="phradio" name="map" onmousedown="cmap(\'ph\')" type="radio">Philippines'."\n".
             '             <input id="mmradio" name="map" onmousedown="cmap(\'mm\')" type="radio" value="ph">Metro Manila :: '."\n".
             '        Station: <span id="st-choice" onmousedown="stcollapse()">Ateneo de Manila University, Quezon City</span>'."\n".
//             '        Station: <span id="st-choice" onmousedown="stcollapse()">Xavier University, Cagayan de Oro</span>'."\n".
             '      </form>'."\n".
             '    </div>'."\n".
             '    <div id="st-options">'."\n".
             '      <table class="left">'."\n".
             '        <tr>'."\n".
             '          <th>Metro Manila</th>'."\n".
             '        </tr>'."\n".
             '        <tr>'."\n".
             '          <td>'."\n".
             '            <ul>'."\n".
             '              <li>Caloocan</li>'."\n".
             '              <li><span id="ca-ky" onmousedown="switchp(\'mw012\')" title="Kaybiga, Caloocan">Kaybiga</span></li>'."\n".
             '              <li><span id="ca-up" onmousedown="switchp(\'mw007\')" title="U Plata, Caloocan">U. Plata (Caltex)</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Las Pinas</li>'."\n".
             '              <li><span id="lp-pa" onmousedown="switchp(\'mw014\')" title="Pamplona, Las Pinas">Pamplona (Caltex)</span></li>'."\n".
             '              <li><span id="lp-sl" onmousedown="switchp(\'mw001\')" title="Southland, Las Pinas">Southland, Talon Uno</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Makati</li>'."\n".
             '              <li><span id="mk-fp" onmousedown="switchp(\'makati05\')" title="Brgy Forbes Park, Makati City">Forbes Park (Brgy.)</span></li>'."\n".
             '              <li><span id="mk-gd" onmousedown="switchp(\'mo004\')" title="Guadalupe, Makati City">Guadalupe</span></li>'."\n".
             '              <li><span id="mk-ch" onmousedown="switchp(\'makati02\')" title="Makati City Hall, Makati City">Makati City Hall</span></li>'."\n".
             '              <li><span id="mk-pb" onmousedown="switchp(\'makati06\')" title="Brgy Pembo, Makati City">Pembo (Brgy.)</span></li>'."\n".
             '              <li><span id="mk-pi" onmousedown="switchp(\'makati07\')" title="Brgy Pinagkaisahan, Makati City">Pinagkaisahan (Brgy.)</span></li>'."\n".
             '              <li><span id="mk-sa" onmousedown="switchp(\'makati03\')" title="Brgy San Antonio, Makati City">San Antonio (Brgy.)</span></li>'."\n".
             '              <li><span id="mk-sl" onmousedown="switchp(\'makati01\')" title="Brgy San Lorenzo, Makati City">San Lorenzo (Brgy.)</span></li>'."\n".
             '              <li><span id="mk-wr" onmousedown="switchp(\'makati04\')" title="Brgy West Rembo, Makati City">West Rembo (Brgy.)</span></li>'."\n".
             '            </ul>'."\n".
             '          </td>'."\n".
             '          <td rowspan="2">'."\n".
             '            <ul>'."\n".
             '              <li>Manila</li>'."\n".
             '              <li><span id="ty-gf" onmousedown="switchp(\'mw010\')" title="Gov Forbes, Tayuman, Manila">Tayuman (Caltex)</span></li>'."\n".
             '              <li><span id="mn-qa" onmousedown="switchp(\'mw017\')" title="Quirino Avenue, Manila">Quirino Avenue (Caltex)</span></li>'."\n".
             '            </ul>'."\n".
//             '            <ul>'."\n".
//             '              <li>Muntinlupa</li>'."\n".
//             '              <li><span id="mu-fl" title="Filinvest, Muntinlupa City">Filinvest</span></li>'."\n".
//             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Marikina</li>'."\n".
             '              <li><span id="mr-ng" onmousedown="switchp(\'mo001\')" title="Nangka, Marikina City">Nangka</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Navotas</li>'."\n".
             '              <li><span id="nv-nv" onmousedown="switchp(\'mw008\')" title="Navotas">Navotas City (Caltex)</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Paranaque</li>'."\n".
             '              <li><span id="pq-kb" onmousedown="switchp(\'mw013\')" title="Kabihasnan, Paranaque">Kabihasnan (Caltex)</span></li>'."\n".
             '              <li><span id="pq-si" onmousedown="switchp(\'mw015\')" title="San Isidro, Paranaque">San Isidro (Caltex)</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Pasay</li>'."\n".
             '              <li><span id="pa-mv" onmousedown="switchp(\'mw016\')" title="Merville, Pasay City">Merville (Caltex)</span></li>'."\n".
             '            </ul>'."\n".
             '          </td>'."\n".
             '          <td rowspan="2">'."\n".
             '            <ul>'."\n".
             '              <li>Pasig</li>'."\n".
             '              <li><span id="pg-dp" onmousedown="switchp(\'mw028\')" title="Brgy dela Paz, Pasig City">dela Paz (Brgy.)</span></li>'."\n".
             '              <li><span id="pg-mf" onmousedown="switchp(\'mw006\')" title="Manggahan Floodway, Pasig City">Manggahan Floodway (Caltex)</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Quezon City</li>'."\n".
             '              <li><span id="qc-mo" onmousedown="switchp(\'MOIP\')" title="Manila Observatory, Quezon City">Ateneo de Manila</span></li>'."\n".
             '              <li><span id="qc-hs" onmousedown="switchp(\'mw002\')" title="Brgy Holy Spirit, Quezon City">Holy Spirit (Caltex)</span></li>'."\n".
             '              <li><span id="qc-km" onmousedown="switchp(\'mw003\')" title="Brgy Kamuning, Quezon City">Kamuning (Caltex)</span></li>'."\n".
             '              <li><span id="qc-mn" onmousedown="switchp(\'mw004\')" title="Mindanao Avenue, Quezon City">Mindanao Avenue (Caltex)</span></li>'."\n".
             '              <li><span id="qc-py" onmousedown="switchp(\'mw018\')" title="Brgy Payatas B, Quezon City">Payatas B (Brgy.)</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>San Juan</li>'."\n".
             '              <li><span id="sj-fb" onmousedown="switchp(\'mw011\')" title="F Blumentrit, San Juan">F. Blumentrit (Caltex)</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Valenzuela</li>'."\n".
             '              <li><span id="va-ma" onmousedown="switchp(\'mw009\')" title="Malinta, Valenzuela">Malinta (Caltex)</span></li>'."\n".
             '            </ul>'."\n".
             '          </td>'."\n".
             '        </tr>'."\n".
             '      </table>'."\n".
             '      <table class="left">'."\n".
             '        <tr>'."\n".
             '          <th>Rizal</th>'."\n".
             '        </tr>'."\n".
             '        <tr>'."\n".
             '          <td>'."\n".
             '            <ul>'."\n".
             '              <li>Angono</li>'."\n".
             '              <li><span id="ag-sv" onmousedown="switchp(\'mw024\')" title="Brgy San Vicente, Angono">San Vicente (Brgy.)</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Antipolo</li>'."\n".
             '              <li><span id="at-sl" onmousedown="switchp(\'mw027\')" title="Brgy San Luis, Antipolo">San Luis (Brgy.)</span></li>'."\n".
             '              <li><span id="at-sr" onmousedown="switchp(\'mw021\')" title="Brgy San Roque, Antipolo">San Roque (Brgy.)</span></li>'."\n".
             '              <li><span id="at-sa" onmousedown="switchp(\'mw005\')" title="Sumulong Avenue, Antipolo">Sumulong Avenue (Caltex)</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Pililla</li>'."\n".
             '              <li><span id="pi-ma" onmousedown="switchp(\'mw023\')" title="Brgy Malaya, Pililla">Malaya (Brgy.)</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Rodriguez</li>'."\n".
             '                <li><span id="rd-sj" onmousedown="switchp(\'mw019\')" title="Brgy San Jose, Rodriguez">San Jose (Brgy.)</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>San Mateo</li>'."\n".
             '                <li><span id="sm-am" onmousedown="switchp(\'mw020\')" title="Brgy Ampid, San Mateo">Ampid (Brgy.)</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Taytay</li>'."\n".
             '              <li><span id="tt-tp" onmousedown="switchp(\'mw022\')" title="Tapayan Pumping Station, Taytay">Tapayan Pumping Station</span></li>'."\n".
             '            </ul>'."\n".
             '          </td>'."\n".
             '        </tr>'."\n".
             '      </table>'."\n".
             '      <table class="left">'."\n".
             '        <tr>'."\n".
             '          <th>Cavite</th>'."\n".
             '        </tr>'."\n".
             '        <tr>'."\n".
             '          <td>'."\n".
             '            <ul>'."\n".
             '              <li>Cavite City</li>'."\n".
             '              <li><span id="cv-cc" onmousedown="switchp(\'mw026\')" title="Corregidor Island, Cavite City">Corregidor Island</span></li>'."\n".
             '            </ul>'."\n".
             '          </td>'."\n".
             '        </tr>'."\n".
             '        <tr>'."\n".
             '          <th>Mindanao</th>'."\n".
             '        </tr>'."\n".
             '        <tr>'."\n".
             '          <td>'."\n".
             '            <ul>'."\n".
             '              <li>Bukidnon</li>'."\n".
             '              <li><span id="bk-da" onmousedown="switchp(\'zipzone\')" title="Dahilayan Adventure Park, Bukidnon">Dahilayan</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Cagayan de Oro</li>'."\n".
             '              <li><span id="co-xu" onmousedown="switchp(\'xuws1\')" title="Xavier University, Cagayan de Oro">Xavier university</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Davao City</li>'."\n".
             '              <li><span id="dc-mo" onmousedown="switchp(\'MOD\')" title="Matina Hills, Davao City">Matina Hills</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Koronadal</li>'."\n".
             '              <li><span id="kr-nm" onmousedown="switchp(\'mo003\')" title="Notre Dame of Marbel, Koronadal">Notre Dame of Marbel</span></li>'."\n".
             '            </ul>'."\n".
             '            <ul>'."\n".
             '              <li>Zamboanga City</li>'."\n".
             '              <li><span id="zc-az" onmousedown="switchp(\'mo002\')" title="Ateneo de Zamboanga, Zamboanga City">Ateneo de Zamboanga</span></li>'."\n".
             '            </ul>'."\n".
             '          </td>'."\n".
             '        </tr>'."\n".
             '      </table>'."\n".
             '            <form class="left st-picks">'."\n".
             '             <input checked="checked" id="allstations" onmouseup="stselect(\'all\',this)" type="checkbox">All Stations</br></br>'."\n".
             '             <input checked="checked" id="mwstations" onmouseup="stselect(\'mw\',this)" type="checkbox">Metro Weather</br>&nbsp;&nbsp;&nbsp;&nbsp;<img alt="MMDA seal" src="./wwi-images/mmda.png"/><img alt="MO seal" src="./wwi-images/logo.png"/><img alt="Chevron seal" src="./wwi-images/chevron.png"/><img alt="Globe seal" src="./wwi-images/globe.png"/></br>&nbsp;&nbsp;&nbsp;&nbsp;<img alt="Caltex seal" src="./wwi-images/caltex_new.png"/><img alt="AdMU seal" src="./wwi-images/admu.png"/></br>'."\n".
             '             <input checked="checked" id="mostations" onmouseup="stselect(\'mo\',this)" type="checkbox">MO Network</br>&nbsp;&nbsp;&nbsp;&nbsp;<img alt="MO seal" src="./wwi-images/logo.png"/><img alt="AdMU seal" src="./wwi-images/admu.png"/><img alt="AdD seal" src="./wwi-images/davao.png"/><img alt="XU seal" src="./wwi-images/cagayan.png"/></br>&nbsp;&nbsp;&nbsp;&nbsp;<img alt="AdZU seal" src="./wwi-images/adzu_sm.jpg"/><img alt="NDM seal" src="./wwi-images/marbel.png"/><img alt="MMDA seal" src="./wwi-images/mmda.png"/></br>'."\n".
             '             <input checked="checked" id="mkstations" onmouseup="stselect(\'mk\',this)" type="checkbox">Makati Network</br>&nbsp;&nbsp;&nbsp;&nbsp;<img alt="City of Makati seal" src="./wwi-images/makati.png"/><img alt="MO seal" src="./wwi-images/logo.png"/></br>'."\n".
             '             <input checked="checked" id="otstations" onmouseup="stselect(\'ot\',this)" type="checkbox">Other Partners</br>&nbsp;&nbsp;&nbsp;&nbsp;<img alt="Zipzone seal" src="./wwi-images/zipzone.jpeg"/></br>'."\n".
             '            </form>'."\n".
             '    </div>'."\n".
             '  </div>';
$map = '    <div class="left map">'."\n".
       '      <span id="topo"><img alt="Topographical Map of the Philippines" src="./wwi-images/ph400.png"/></span>'."\n".
	  //  '      <span id="qmorph"><img alt="QMORPH Rainfall" src="./wwi-images/qmorph00.png"/></span>'."\n".
       '      <div class="map-stns" id="ph-map">'."\n".
       '        <div class="dot" id="MOIP" onmousedown="switchp(\'MOIP\')" onmouseover="tooltip(\'MOIP\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="MOD" onmousedown="switchp(\'MOD\')" onmouseover="tooltip(\'MOD\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="xuws1" onmousedown="switchp(\'xuws1\')" onmouseover="tooltip(\'xuws1\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mo001" onmousedown="switchp(\'mo001\')" onmouseover="tooltip(\'mo001\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mo002" onmousedown="switchp(\'mo002\')" onmouseover="tooltip(\'mo002\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mo003" onmousedown="switchp(\'mo003\')" onmouseover="tooltip(\'mo003\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="zipzone" onmousedown="switchp(\'zipzone\')" onmouseover="tooltip(\'zipzone\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mo004" onmousedown="switchp(\'mo004\')" onmouseover="tooltip(\'mo004\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="makati01" onmousedown="switchp(\'makati01\')" onmouseover="tooltip(\'makati01\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="makati02" onmousedown="switchp(\'makati02\')" onmouseover="tooltip(\'makati02\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="makati03" onmousedown="switchp(\'makati03\')" onmouseover="tooltip(\'makati03\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="makati04" onmousedown="switchp(\'makati04\')" onmouseover="tooltip(\'makati04\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="makati05" onmousedown="switchp(\'makati05\')" onmouseover="tooltip(\'makati05\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="makati06" onmousedown="switchp(\'makati06\')" onmouseover="tooltip(\'makati06\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="makati07" onmousedown="switchp(\'makati07\')" onmouseover="tooltip(\'makati07\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw001" onmousedown="switchp(\'mw001\')" onmouseover="tooltip(\'mw001\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw002" onmousedown="switchp(\'mw002\')" onmouseover="tooltip(\'mw002\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw003" onmousedown="switchp(\'mw003\')" onmouseover="tooltip(\'mw003\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw004" onmousedown="switchp(\'mw004\')" onmouseover="tooltip(\'mw004\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw005" onmousedown="switchp(\'mw005\')" onmouseover="tooltip(\'mw005\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw006" onmousedown="switchp(\'mw006\')" onmouseover="tooltip(\'mw006\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw007" onmousedown="switchp(\'mw007\')" onmouseover="tooltip(\'mw007\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw008" onmousedown="switchp(\'mw008\')" onmouseover="tooltip(\'mw008\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw009" onmousedown="switchp(\'mw009\')" onmouseover="tooltip(\'mw009\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw010" onmousedown="switchp(\'mw010\')" onmouseover="tooltip(\'mw010\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw011" onmousedown="switchp(\'mw011\')" onmouseover="tooltip(\'mw011\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw012" onmousedown="switchp(\'mw012\')" onmouseover="tooltip(\'mw012\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw013" onmousedown="switchp(\'mw013\')" onmouseover="tooltip(\'mw013\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw014" onmousedown="switchp(\'mw014\')" onmouseover="tooltip(\'mw014\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw015" onmousedown="switchp(\'mw015\')" onmouseover="tooltip(\'mw015\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw016" onmousedown="switchp(\'mw016\')" onmouseover="tooltip(\'mw016\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw017" onmousedown="switchp(\'mw017\')" onmouseover="tooltip(\'mw017\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw018" onmousedown="switchp(\'mw018\')" onmouseover="tooltip(\'mw018\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw019" onmousedown="switchp(\'mw019\')" onmouseover="tooltip(\'mw019\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw020" onmousedown="switchp(\'mw020\')" onmouseover="tooltip(\'mw020\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw021" onmousedown="switchp(\'mw021\')" onmouseover="tooltip(\'mw021\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw022" onmousedown="switchp(\'mw022\')" onmouseover="tooltip(\'mw022\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw023" onmousedown="switchp(\'mw023\')" onmouseover="tooltip(\'mw023\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw024" onmousedown="switchp(\'mw024\')" onmouseover="tooltip(\'mw024\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw026" onmousedown="switchp(\'mw026\')" onmouseover="tooltip(\'mw026\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw027" onmousedown="switchp(\'mw027\')" onmouseover="tooltip(\'mw027\',event)" onmouseout="toolreset()"></div>'."\n".
       '        <div class="dot" id="mw028" onmousedown="switchp(\'mw028\')" onmouseover="tooltip(\'mw028\',event)" onmouseout="toolreset()"></div>'."\n".
       '      </div>'."\n".
       '      <div id="colorbar"></div>'."\n".
       '      <div class="hidden" id="rainbar"><table><tr><td id="rn0">0</td><td id="rn1">5</td><td id="rn2">10</td><td id="rn3">15</td><td id="rn4">20</td><td id="rn5">25</td><td id="rn6">30</td><td id="rn7">35</td><td id="rn8">40</td><td id="rn9">45</td><td id="rn10">&gt;50</td></tr></table></div>'."\n".
       '      <div class="hidden" id="rainaccbar"><table><tr><td id="rn0">0</td><td id="rn1">10</td><td id="rn2">20</td><td id="rn3">30</td><td id="rn4">40</td><td id="rn5">50</td><td id="rn6">60</td><td id="rn7">70</td><td id="rn8">80</td><td id="rn9">90</td><td id="rn10">&gt;100</td></tr></table></div>'."\n".
       '      <div class="hidden" id="tempbar"><table><tr><td id="tp0">16</td><td id="tp1">18</td><td id="tp2">20</td><td id="tp3">22</td><td id="tp4">24</td><td id="tp5">26</td><td id="tp6">28</td><td id="tp7">30</td><td id="tp8">32</td><td id="tp9">34</td><td id="tp10">36</td></tr></table></div>'."\n".
       '    </div>'."\n".
       '    <div id="st-tooltip"></div>';
$info = '    <div class="left panels">'."\n".
        '      <div class="pactive right" id="prain" onclick="switchwu(\'rain\')"></div>'."\n".
        '      <div class="pnot right" id="ptemp" onclick="switchwu(\'temp\')"></div>'."\n".
        '      <div class="pnot right" id="pwind" onclick="switchwu(\'wind\')"></div>'."\n".
        '      <div class="pnot right" id="ppres" onclick="switchwu(\'pres\')"></div>'."\n".
        '    </div>'."\n".
        '    <div class="left writeup" id="pwriteup">'."\n".
        '    </div>'."\n";
$mapnav = '    <div class="left mapnavi">'."\n".
          '      <input checked="checked" name="parameter" onmouseup="mapparam(\'rain\')" type="radio"> Rainfall Rate</br>'."\n".
          '      <input name="parameter" onmouseup="mapparam(\'racc\')" type="radio"> Accumulated Rainfall (24hrs)</br>'."\n".
          '      <input name="parameter" onmouseup="mapparam(\'tmp\')" type="radio"> Temperature</br></br>'."\n".
		  // '      <span id="qoptions"><input id="qcheck" name="qmorph" onmouseup="qmorph(this)" type="checkbox"> QMORPH Rainfall, Last Updated: '.date('F d Y H:i', filemtime('../wwi-data/satellite/qmorph00.csv')).'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input name="qtime" onmouseup="qmorphstep(\'06\')" type="radio"> <input name="qtime" onmouseup="qmorphstep(\'05\')" type="radio"> <input name="qtime" onmouseup="qmorphstep(\'04\')" type="radio">  <input name="qtime" onmouseup="qmorphstep(\'03\')" type="radio"> <input name="qtime" onmouseup="qmorphstep(\'02\')" type="radio"> <input name="qtime" onmouseup="qmorphstep(\'01\')" type="radio"> <input checked="checked" name="qtime" onmouseup="qmorphstep(\'00\')" type="radio"></span>'."\n".
          '    </div>'."\n";

$content = '  <div class="content">'."\n".$map."\n".$info."\n".$mapnav."\n".'  </div>';

$hidden = '';

// stations-color stylesheets

  $srain = '';
  $sracc = '';
  $stmp = '';
  $row = 1;
  if (($handle = fopen('../wwi/data-met/latest.csv', 'r')) !== FALSE) {
    while (($data = fgetcsv($handle, 150, ',')) !== FALSE) {
      $row++;
  switch($data[0]) {
    case 'MOIP': $station = 'Ateneo de Manila University, Quezon City'; break;
    case 'MOD': $station = 'Matina Hills, Davao City'; break;
    case 'xuws1': $station = 'Xavier University, Cagayan de Oro City'; break;
    case 'mo001': $station = 'Nangka, Marikina City'; break;
    case 'mo002': $station = 'Ateneo de Zamboanga University, Zamboanga City'; break;
    case 'mo003': $station = 'Notre Dame of Marbel University, Koronadal City'; break;
    case 'zipzone': $station = 'Dahilayan Adventure Park, Bukidnon'; break;
    case 'mo004': $station = 'Guadalupe, Makati City (MMDA-MO Station)'; break;
    case 'makati01': $station = 'Brgy. San Lorenzo, Makati City'; break;
    case 'makati02': $station = 'Makati City Hall, Makati City'; break;
    case 'makati03': $station = 'Brgy. San Antonio, Makati City'; break;
    case 'makati04': $station = 'Brgy. West Rembo, Makati City'; break;
    case 'makati05': $station = 'Brgy. Forbes Park, Makati City'; break;
    case 'makati06': $station = 'Brgy. Pembo, Makati City (OSMAK)'; break;
    case 'makati07': $station = 'Brgy. Pinagkaisahan, Makati City'; break;
    case 'mw001': $station = 'Southland, Talon Uno, Las Pinas City'; break;
    case 'mw002': $station = 'Brgy. Holy Spirit, Quezon City (Caltex)'; break;
    case 'mw003': $station = 'Brgy. Kamuning, Quezon City (Caltex)'; break;
    case 'mw004': $station = 'Mindanao Avenue, Quezon City (Caltex)'; break;
    case 'mw005': $station = 'Sumulong Avenue, Antipolo, Rizal (Caltex)'; break;
    case 'mw006': $station = 'Manggahan Floodway, Pasig City (Caltex)'; break;
    case 'mw007': $station = 'U. Plata, Caloocan City (Caltex)'; break;
    case 'mw008': $station = 'Navotas City (Caltex)'; break;
    case 'mw009': $station = 'Malinta, Valenzuela (Caltex)'; break;
    case 'mw010': $station = 'Gov. Forbes Tayuman, Manila (Caltex)'; break;
    case 'mw011': $station = 'F. Blumentrit, San Juan (Caltex)'; break;
    case 'mw012': $station = 'Kaybiga, Caloocan City'; break;
    case 'mw013': $station = 'Kabihasnan, Paranaque (Caltex)'; break;
    case 'mw014': $station = 'Pamplona, Las Pinas City (Caltex)'; break;
    case 'mw015': $station = 'San Isidro, Sucat, Paranaque (Caltex)'; break;
    case 'mw016': $station = 'Merville, Pasay City (Caltex)'; break;
    case 'mw017': $station = 'Quirino Avenue, Manila (Caltex)'; break;
    case 'mw018': $station = 'Brgy. Payatas B, Quezon City'; break;
    case 'mw019': $station = 'Brgy. San Jose, Rodriguez, Rizal'; break;
    case 'mw020': $station = 'Brgy. Ampid, San Mateo, Rizal'; break;
    case 'mw021': $station = 'Brgy. San Roque, Antipolo City, Rizal'; break;
    case 'mw022': $station = 'Tapayan Pumping Station, Taytay, Rizal'; break;
    case 'mw023': $station = 'Brgy. Malaya, Pililla, Rizal'; break;
    case 'mw024': $station = 'Brgy. San Vicente, Angono, Rizal'; break;
    case 'mw026': $station = 'Corregidor Island, Cavite City'; break;
    case 'mw027': $station = 'Brgy. San Luis, Antipolo City, Rizal'; break;
    case 'mw028': $station = 'Brgy. dela Paz, Pasig City'; break;
  }  
      if($data[0]=='MOIP'){$hi = '.';}else{$hi = ' but feels like <span class="highlight">'.$data[7].' &deg;C</span> because of the humidity.';};
      $clratio = round((($data[3] / $data[17]) * 100), 2);
      $cltmp = $data[14] - $data[4];
      $cltmn = $data[16] - $data[5];
      $cltmx = $data[15] - $data[6];
      switch(true) {
        case $cltmp > 0: $cltmptrend = 'less than'; break;
        case $cltmp = 0: $cltmptrend = 'equal to'; break;
        case $cltmp < 0: $cltmptrend = 'greater than'; break;
      }
      switch(true) {
        case $cltmn > 0: $cltmntrend = 'less than'; break;
        case $cltmn = 0: $cltmntrend = 'equal to'; break;
        case $cltmn < 0: $cltmntrend = 'greater than'; break;
      }
      switch(true) {
        case $cltmx > 0: $cltmxtrend = 'less than'; break;
        case $cltmx = 0: $cltmxtrend = 'equal to'; break;
        case $cltmx < 0: $cltmxtrend = 'greater than'; break;
      }
      $hidden = $hidden.'<div class="hidden" id="'.$data[0].'-prain"><div class="left"><p>Rainfall Rate (mm/hr)</p><h3>'.$data[2].'</h3></div><div class="left"><p>Accumulated (mm/24hr)</p><h3>'.$data[3].'</h3></div></div>'."\n".
                        '<div class="hidden" id="'.$data[0].'-ptemp"><div class="left"><p>Temperature (&deg;C)</p><h3>'.$data[4].'</h3></div><div class="left"><p>24hr Max (&deg;C): <span class="tmpval">'.$data[6].'</span></p><p>24hr Min (&deg;C): <span class="tmpval">'.$data[5].'</span></p></div></div>'."\n".
                        '<div class="hidden" id="'.$data[0].'-pwind"><div class="left"><p>Windspeed (m/s)</p><h3>'.$data[8].'</h3></div><div class="left"><p>Wind Direction (&deg;)</p><h3>'.$data[9].'</h3></div></div>'."\n".
                        '<div class="hidden" id="'.$data[0].'-ppres"><div class="left"><p>Air Pressure (mbar)</p><h3>'.$data[11].'</h3></div></div>'."\n".
                        '<div class="hidden" id="'.$data[0].'-rain">At <span class="highlight">'.$data[1].'</span>, there was <span class="highlight">'.$data[2].' mm</span> rainfall received at <span class="highlight">'.$station.'</span>.  There have been <span class="highlight">'.$data[3].' mm</span> accumulated rainfall for the past 24 hours.  This is <span class="highlight">'.$clratio.'%</span> of the historical maximum 24hr rainfall for this area which was <span class="highlight">'.$data[17].' mm</span>.</div>'."\n".
                        '<div class="hidden" id="'.$data[0].'-temp">At <span class="highlight">'.$data[1].'</span>, the temperature at <span class="highlight">'.$station.'</span> was <span class="highlight">'.$data[4].' &deg;C</span>'.$hi.'  In the past 24 hours, local temperature got up to <span class="highlight">'.$data[6].' &deg;C</span> and got as low as <span class="highlight">'.$data[5].' &deg;C</span>.</div>'."\n".
                        '<div class="hidden" id="'.$data[0].'-wind">At <span class="highlight">'.$data[1].'</span>, the wind at <span class="highlight">'.$station.'</span> was blowing from <span class="highlight">'.$data[9].'&deg;</span> at <span class="highlight">'.$data[8].'</span> m/s.</div>'."\n".
                        '<div class="hidden" id="'.$data[0].'-pres">At <span class="highlight">'.$data[1].'</span>, the air pressure was <span class="highlight">'.$data[11].' mb</span> at <span class="highlight">'.$station.'</span>.</div>'."\n".
                        '<div class="hidden" id="'.$data[0].'-tooltip"><img class="loresgraph" src="./wwi-data/graphs/day/'.$data[0].'/rain_lo.png"/></br>Station: <span class="hitip">'.$station.'</span></br>Last updated: <span class="hitip">'.$data[1].'</span></br>Rainfall: <span class="hitip">'.$data[2].' mm/hr ('.$data[3].' mm/24hr)</span></br>Temperature: <span class="hitip">'.$data[4].' &deg;C (hi: '.$data[6].', lo: '.$data[5].')</span></br>Wind: <span class="hitip">'.$data[8].' m/s, '.$data[9].' &deg;</span></br>Pressure: <span class="hitip">'.$data[11].' mbar</span></div>'."\n\n";
      switch(true) {
        case $data[2] >= 50: $raincolor = '#0e1743'; break;
        case $data[2] >= 45: $raincolor = '#262e55'; break;
        case $data[2] >= 40: $raincolor = '#3e4568'; break;
        case $data[2] >= 35: $raincolor = '#565c7b'; break;
        case $data[2] >= 30: $raincolor = '#6e738e'; break;
        case $data[2] >= 25: $raincolor = '#868ba1'; break;
        case $data[2] >= 20: $raincolor = '#9ea2b3'; break;
        case $data[2] >= 15: $raincolor = '#b6b9c6'; break;
        case $data[2] >= 10: $raincolor = '#c3d0d9'; break;
        case $data[2] >= 5: $raincolor = '#e6e7ec'; break;
        case $data[2] >= 0: $raincolor = '#ffffff'; break;
      }
      $srain = $srain."\n".
               '#'.$data[0].' {'."\n".
               '  background-color: '.$raincolor.';'."\n".
               '}';
      switch(true) {
        case $data[3] >= 100: $racccolor = '#0e1743'; break;
        case $data[3] >= 90: $racccolor = '#262e55'; break;
        case $data[3] >= 80: $racccolor = '#3e4568'; break;
        case $data[3] >= 70: $racccolor = '#565c7b'; break;
        case $data[3] >= 60: $racccolor = '#6e738e'; break;
        case $data[3] >= 50: $racccolor = '#868ba1'; break;
        case $data[3] >= 40: $racccolor = '#9ea2b3'; break;
        case $data[3] >= 30: $racccolor = '#b6b9c6'; break;
        case $data[3] >= 20: $racccolor = '#c3d0d9'; break;
        case $data[3] >= 10: $racccolor = '#e6e7ec'; break;
        case $data[3] >= 0: $racccolor = '#ffffff'; break;
      }
      $sracc = $sracc."\n".
               '#'.$data[0].' {'."\n".
               '  background-color: '.$racccolor.';'."\n".
               '}';
      switch(true) {
        case $data[4] >= 36: $tmpcolor = '#bc2915'; break;
        case $data[4] >= 34: $tmpcolor = '#ab2d2b'; break;
        case $data[4] >= 32: $tmpcolor = '#9b3142'; break;
        case $data[4] >= 30: $tmpcolor = '#8b3559'; break;
        case $data[4] >= 28: $tmpcolor = '#7b396f'; break;
        case $data[4] >= 26: $tmpcolor = '#6b3e86'; break;
        case $data[4] >= 24: $tmpcolor = '#5b429d'; break;
        case $data[4] >= 22: $tmpcolor = '#4b46b3'; break;
        case $data[4] >= 20: $tmpcolor = '#3b4aca'; break;
        case $data[4] >= 18: $tmpcolor = '#2b4ee1'; break;
        case $data[4] >= 16: $tmpcolor = '#1b53f8'; break;
      }
      $stmp = $stmp."\n".
               '#'.$data[0].' {'."\n".
               '  background-color: '.$tmpcolor.';'."\n".
               '}';
    }
    fclose($handle);
  }
$outrain = fopen('../wwi-styles/stations-color-rain.css', 'w');
fwrite($outrain, $srain);
fclose($outrain);
$outacc = fopen('../wwi-styles/stations-color-racc.css', 'w');
fwrite($outacc, $sracc);
fclose($outacc);
$outtmp = fopen('../wwi-styles/stations-color-tmp.css', 'w');
fwrite($outtmp, $stmp);
fclose($outtmp);
//

$body = '<body onload="stdefault()" id="root-node">'."\n".'<div class="root">'."\n".$header."\n".$navigation."\n".$selectors."\n".$content."\n".$hidden."\n".'</div>'."\n".'</body>';
// index.html output
$wwi = '<!DOCTYPE html>'."\n".'<html>'."\n".$head."\n".$body."\n".'</html>';
$output = fopen('../index.php', 'w');
fwrite($output, $wwi);
fclose($output);
?>