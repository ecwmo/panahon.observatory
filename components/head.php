<?php
    session_start();
    // set the default timezone to use. Available since PHP 5.1
    date_default_timezone_set('Asia/Manila');

    include_once(__DIR__.'/../config/config.php');

    $pages = array('reports' => "Extreme Weather Report");

    $curPage = basename($_SERVER['PHP_SELF']);
    $curStyle = './wwi-styles/' . str_replace(".php", ".css", $curPage);
    $curScript = './wwi-scripts/' . str_replace(".php", ".js", $curPage);

    if ($_GET['view']=="draft") {
        $imgSrc = "draft";
        $simgSrc = "sdraft";
    } else {
        $imgSrc = "public";
        $simgSrc = "static";
    }

    function getTitle($curPage, $pages)
    {
        foreach ($pages as $pageName => $pageTitle) {
            if ($curPage == $pageName . '.php') {
                echo $pageTitle . " - ";
            }
        }
        echo "Weather and Climate Reasearch - Manila Observatory";
    }
?>

<head>
    <title>
        <?php getTitle($curPage, $pages); ?>
    </title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Experimental model forecasts for the Philippine" />

    <link rel="shortcut icon" href="/resources/static/logo.png">

    <link href="/dist/styles.css" rel="stylesheet" type="text/css" />
</head>