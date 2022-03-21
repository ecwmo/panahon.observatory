<?php
    include_once(__DIR__.'/../start.php');

    $ROOT_IMG_DIR = '../resources/model/web_img';

    $imgSrc = $ROOT_IMG_DIR;
    $cmapImgSrc = $ROOT_IMG_DIR.'/cmap';

    $imgs = glob($imgSrc  .'/*.png', GLOB_BRACE);
    $cmapImgs = glob($cmapImgSrc  .'/*.png', GLOB_BRACE);

    $data = [
        "imgs" => $imgs,
        "cmaps" => $cmapImgs
    ];

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    echo str_replace("..", "", json_encode($data));
