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

function getTitle($curPage, $pages) {
  $npage = count($pages);
  for($p = 0; $p < $npage; $p++) {
    if ($curPage == $pages[$p][0] . '.php') {
      return $pages[$p][3];
    }
  }
  return "Weather Watch Initiative - Manila Observatory";
}

function buildMenu($curPage, $pages) {
  $npage = count($pages);
  for($p = 0; $p < $npage; $p++) {
    $href = './' . $pages[$p][0] . '.php';
    if ($curPage == $pages[$p][0] . '.php') {
      $class = "nav-item active";
    } else {
      $class = "nav-item";
    }
    echo '<li class="' . $class . '"><a class="nav-link" href="' . $href . '" title="'. $pages[$p][1] .'">' .$pages[$p][2] . '</a></li>';
  }
}

$curPage = basename($_SERVER['PHP_SELF']);
$curStyle = './wwi-styles/' . str_replace(".php", ".css", $curPage);


echo '

<!doctype html>
<html lang="en">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <meta name="description" content="Experimental model forecasts for the Philippine" />

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
    crossorigin="anonymous">

  <link href="./wwi-styles/main.css" rel="stylesheet" type="text/css" />
  <link href="' . $curStyle . '" rel="stylesheet" type="text/css" />

  <title>'. getTitle($curPage, $pages) . '</title>
</head>

<body>
<div class="container">
    <header class="p-2">
      <div class="row">
        <div class="col-8">
          <img alt="Manila Observatory Logo" class="float-left" src="./wwi-images/logo.png" />
          <div class="float-left">
            <p class="font-weight-bold">Manila Observatory</p>
            <p>Ateneo de Manila University Campus</p>
            <p>Loyola Heights, Quezon City, Philippines</p>
          </div>
          <div class="float-left head-contact">
            <p>Tel: (632) 426-5921 / 426-0837 / 426-6495</p>
            <p>Fax: (632) 426-0847 / 426-6141</p>
            <p>Email: <a href="#" title="Manila Observatory email address">manila@observatory.ph</a></p>
          </div>
        </div>
      </div>
    </header>
    <nav class="navbar navbar-light navbar-expand-lg navbar-custom p-0">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">';
        buildMenu($curPage, $pages);
echo '
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item"><a class="nav-link" href="faq.html" title="Frequently Asked Questions">FAQ</a></li>
        </ul>
      </div>
    </nav>';

?>
