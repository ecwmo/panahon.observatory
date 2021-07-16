<?php
    session_start();
    // set the default timezone to use. Available since PHP 5.1
    date_default_timezone_set('Asia/Manila');

    include_once(__DIR__.'/../config.php');

    $pages = array('reports' => "Extreme Weather Report");

    $curPage = basename($_SERVER['PHP_SELF']);

    function getTitle($curPage, $pages)
    {
        foreach ($pages as $pageName => $pageTitle) {
            if ($curPage == $pageName . '.php') {
                echo $pageTitle . " - ";
            }
        }
        echo "Weather and Climate Reasearch - Manila Observatory";
    }

    function alpine($var) {
        echo str_replace(["'", '"'], ["\'", "'"], json_encode($var));
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

    <?php if($curPage == "new-report.php") { ?>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.3/css/fontawesome.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.3/css/solid.min.css" />

    <?php } ?>
    <link href="/dist/styles.css" rel="stylesheet" type="text/css" />
</head>