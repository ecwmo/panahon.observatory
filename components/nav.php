<?php
/*
$pages = array(
  array("index", "Latest Summaries - Weather Conditions and Maps", "Quick View", "Weather Watch Initiative - Manila Observatory"),
  array("stations", "Observation Stations - Graphs and Information", "Stations", "Observation Stations - Weather Watch Initiative (Manila Observatory)"),
  array("models", "Model Results - Forecasts and Maps", "Models", "Experimental Model Forecasts - Weather Watch Initiative (Manila Observatory)"),
  array("satellites", "Remote Sensing - Satellite Images", "Satellites", "Satellite Maps - Weather Watch Initiative (Manila Observatory)"),
  array("climate", "Philippine Climate Information", "Climate", "Philippine Climate - Weather Watch Initiative (Manila Observatory)"),
  array("reports", "Tropical Cyclone Report", "Reports", "Tropical Cyclone - Weather Watch Initiative (Manila Observatory)")
);
*/

$pages = array(
    array("index", "Latest Summaries - Weather Conditions and Maps", "Quick View", "Weather Watch Initiative - Manila Observatory"),
    array("satellites", "Remote Sensing - Satellite Images", "Satellites", "Satellite Maps - Weather Watch Initiative (Manila Observatory)"),
    array("climate", "Philippine Climate Information", "Climate", "Philippine Climate - Weather Watch Initiative (Manila Observatory)"),
    array("reports", "Tropical Cyclone Report", "Reports", "Tropical Cyclone - Weather Watch Initiative (Manila Observatory)")
);

?>
<nav class="bg-blue-900 border border-black flex justify-between">
    <!-- <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button> -->
    <ul class="flex">
        <?php buildMenu($curPage, $pages); ?>
    </ul>
    <ul class="flex">
        <li class="py-1 px-2 border-l border-black uppercase hover:bg-blue-600"><a href="faq.html" title="Frequently Asked Questions">FAQ</a></li>
    </ul>
</nav>