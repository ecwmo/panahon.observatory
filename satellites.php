<!DOCTYPE html>
<html>
<head>
  <title>Satellite Maps - Weather Watch Initiative (Manila Observatory)</title>
  <meta name="description" content="Local Philippine climate maps"/>
  <meta charset="UTF-8"/>
  <link href="./wwi-styles/default.css" rel="stylesheet" type="text/css"/>
  <!-- <script src="./wwi-scripts/satellites.js" type="text/javascript"></script> -->
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
      <li><a href="./index.php" title="Latest Summaries - Weather Conditions and Maps">Quick View</a></li>
<!--      <li><a href="./stations.php" title="Observation Stations - Graphs and Information">Stations</a></li>
      <li><a href="./models.php" title="Model Results - Forecasts and Maps">Models</a></li>-->
      <li class="active">Satellites</li>
      <li><a href="./climate.php" title="Philippine Climate Information">Climate</a></li>
      <li><a href="./reports.php" title="Manila Observatory Reports Archive">Reports</a></li>
    </ul>
    <a class="right" href="faq.html" title="Frequently Asked Questions">FAQ</a>
  </div>
  <div class="content satellites">
    <div class="satbox">
      <h4>MTSAT Infrared Image</h4>
      <a href="http://tropic.ssec.wisc.edu/real-time/imagemain.php?&basin=westpac&prod=irn&sat=gms" target="_blank">
        <img alt="CIMSS IR Satellite" id="cimss" src="http://tropic.ssec.wisc.edu/real-time/westpac/images/irngms.GIF"/>
      </a>
      <ul>
        <li>This image is taken from the Cooperative Institute for Meteorological Satellite Studies (CIMSS).</li></br>
	    <li>Timestamp is ~1-2 hours earlier than current time.</li></br>
	    <li>Areas of white and red, especially bright white, indicate cloud systems that have greater potential for rainfall.</li>
      </ul>
    </div>
<!--    <div class="satbox">
      <h4>MTSAT Visible Image</h4>
      <a href="http://www.cwb.gov.tw/V7e/observe/satellite/Sat_EA.htm" target="_blank">
        <img alt="CWB Visible Satellite" src="./resources/cwb/latest.jpg"/>
      </a>
      <ul>
        <li>This image is courtesy of the Central Weather Bureau, Taiwan, R.O.C.</li>
      </ul>
    </div> -->
	<div class="satbox track">
      <h4>Typhoon Track (Joint Typhoon Warning Center)</h2>
      <a href="http://www.metoc.navy.mil/jtwc/jtwc.html" target="_blank">
        <img alt="JTWC Typhoon Track" id="jaxa" src="./resources/jtwc/latest.gif"/>
      </a>
    </div>
<!--    <div class="satbox qmrain">
      <h4>QMORPH Rainfall</h4>
      <img alt="QMORPH Rainfall" id="cimss" src="./wwi-images/qmorph.gif"/>
      <ul>
        <li>This image is taken from the Cooperative Institute for Meteorological Satellite Studies (CIMSS).</li></br>
      </ul>
    </div>
    <div class="satbox qmrain">
      <h4>QMORPH Accumulated Rainfall</h4>
      <img alt="QMORPH Rainfall" id="cimss" src="./wwi-images/qmorph_accum.gif"/>
      <ul>
        <li>This image is taken from the Cooperative Institute for Meteorological Satellite Studies (CIMSS).</li></br>
      </ul>
    </div>-->
<!--    <div class="satbox jaxa">
      <h4>Hourly Accumulated Rainfall</h2>
      <a href="http://sharaku.eorc.jaxa.jp/GSMaP/" target="_blank">
        <img alt="JAXA Accumulated Rainfall" id="jaxa" src="./resources/jaxa-rain/latest.jpg"/>
      </a>
	  <img alt="JAXA Accumulated Rainfall Colorbar" src="./wwi-images/jaxa_color_bar.png"/>
	  <ul>
        <li>Rainfall estimate courtesy of Japan Aerospace Exploration Agency (JAXA).</li></br>
	    <li>Color bar indicates rain amount in millimeters per hour.</li>
      </ul>
    </div>-->

  </div>
</div>
</body>
</html>
