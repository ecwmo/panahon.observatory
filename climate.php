<!DOCTYPE html>
<html>
<head>
  <title>Philippine Climate - Weather Watch Initiative (Manila Observatory)</title>
  <meta name="description" content="Local Philippine climate maps"/>
  <meta charset="UTF-8"/>
  <link href="./wwi-styles/default.css" rel="stylesheet" type="text/css"/>
  <script src="./wwi-scripts/climate.js" type="text/javascript"></script>
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
      <li><a href="./satellites.php" title="Remote Sensing - Satellite Images">Satellites</a></li>
      <li class="active">Climate</li>
      <li><a href="./reports.php" title="Manila Observatory Reports Archive">Reports</a></li>
    </ul>
    <a class="right" href="faq.html" title="Frequently Asked Questions">FAQ</a>
  </div>
  <div class="selectors">
    <div class="choice ch-climate">
      <form>
        <input checked="checked" id="rain" onchange="climate('rain_map',this);" type="checkbox">Rainfall
        <input id="tmn" onchange="climate('tmn_map',this)" type="checkbox">Minimum Temperature
        <input id="tmp" onchange="climate('tmp_map',this)" type="checkbox">Average Temperature
        <input id="tmx" onchange="climate('tmx_map',this)" type="checkbox">Maximum Temperature
      </form>
    </div>
  </div>
  <div class="content climate">
    <div id="rain_map"></br>
      <h4>Rainfall</h4>
      <p>These maps show the average daily rainfall and maximum daily rainfall for the Philippines over the period of 1951 to 2007.  The average daily rainfall is taken as the mean of all rainfall per day within the period of 1951 to 2007, while the maximum daily rainfall indicates the highest daily rainfall recorded for each area in the past 57 years.</p>
      <p class="source">Source: APHRODITE V1003R1 (Yatagai et al., 2009)</p></br>
      <img alt="Philippine Annual Average Rainfall" src="./wwi-images/APHROrain_annave_5107.png"/>
      <img alt="Philippine Annual Maximum Rainfall" src="./wwi-images/APHROrain_max_5107.png"/>
    </div>
    <div id="tmn_map"></br>
      <h4>Minimum Temperature</h4>
      <p>These maps show the average daily minimum temperature and maximum daily minimum temperature for the Philippines over the period of 1951 to 2009.  The average daily minimum temperature is taken as the mean of all minimum temperatures per day within the period of 1951 to 2009.  On the other hand, the maximum daily minimum temperature indicates the highest daily minimum temperature for each area in the past 59 years.</p>
      <p class="source">Source: CRU TS3.1 (Mitchell and Jones, 2005)</p></br>
      <img alt="Philippine Annual Average Min Temperature" src="./wwi-images/CRUtmn_annave_5109.png"/>
      <img alt="Philippine Annual Maximum Min Temperature" src="./wwi-images/CRUtmn_max_5109.png"/>
    </div>
    <div id="tmp_map"></br>
      <h4>Mean Temperature</h4>
      <p>These maps show the average daily mean temperature and maximum daily mean temperature for the Philippines over the period of 1951 to 2009.  The annual mean daily mean temperature is taken as the average of all mean temperatures per day within the period of 1951 to 2009.  On the other hand, the maximum daily mean temperature indicates the highest daily mean temperature for each area in the past 59 years.</p>
      <p class="source">Source: CRU TS3.1 (Mitchell and Jones, 2005)</p></br>
      <img alt="Philippine Annual Average Temperature" src="./wwi-images/CRUtmp_annave_5109.png"/>
      <img alt="Philippine Annual Maximum Temperature" src="./wwi-images/CRUtmp_max_5109.png"/>
    </div>
    <div id="tmx_map"></br>
      <h4>Maximum Temperature</h4>
      <p>These maps show the average daily maximum temperature and maximum daily maximum temperature for the Philippines over the period of 1951 to 2009.  The average daily maximum temperature is taken as the mean of all maximum temperatures per day within the period of 1951 to 2009.  On the other hand, the maximum daily maximum temperature indicates the highest daily maximum temperature for each area in the past 59 years.</p>
      <p class="source">Source: CRU TS3.1 (Mitchell and Jones, 2005)</p></br>
      <img alt="Philippine Annual Average Max Temperature" src="./wwi-images/CRUtmx_annave_5109.png"/>
      <img alt="Philippine Annual Maximum Max Temperature" src="./wwi-images/CRUtmx_max_5109.png"/>
    </div>
  </div>
</div>
</body>
</html>
