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
<nav class="navbar navbar-light navbar-expand-lg navbar-custom p-0">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <?php buildMenu($curPage, $pages); ?>
        </ul>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item"><a class="nav-link" href="faq.html" title="Frequently Asked Questions">FAQ</a></li>
        </ul>
    </div>
</nav>