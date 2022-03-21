<?php
    include_once(__DIR__.'/../start.php');
    require_once 'Config/Lite.php';
    $cfg = new Config_Lite(RES_REPORTS_DIR.'/report.ini', LOCK_EX);

    $ROOT_IMG_DIR = '../resources/reports';
    if ($_GET['view']=="draft") {
        $imgSrc = $ROOT_IMG_DIR.'/img/draft';
        $simgSrc = $ROOT_IMG_DIR.'/img/sdraft';
    } else {
        $tccode = $cfg->get("public", "tccode");
        $repnum = $cfg->get("public", "reportnum");
        $imgSrc = $ROOT_IMG_DIR.'/'.$tccode .'/'.$repnum .'/img';
        $simgSrc = $ROOT_IMG_DIR.'/img/static';
    }
    $reportImgs = glob($imgSrc  .'/*.{jpg,png}', GLOB_BRACE);
    $reportSImgs = glob($simgSrc  .'/*.{jpg,png}', GLOB_BRACE);

    $data = [
        "reportImgs" => $reportImgs,
        "staticImgs" => $reportSImgs
    ];

    header('Content-Type: application/json');

    echo str_replace("..", "", json_encode($data));
