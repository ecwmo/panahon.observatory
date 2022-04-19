<?php
    include_once(__DIR__.'/../start.php');

    $file = '../resources/model/info.json';
    $info = file_get_contents($file);
    $info = json_decode($info, true);

    $ROOT_IMG_DIR = '../resources/model/img';
    $globPattern = "/*{$info['year']}-{$info['month']}-{$info['day']}_{$info['hour']}*.png";
    $imgs = glob($ROOT_IMG_DIR  . $globPattern, GLOB_BRACE);

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    echo str_replace("..", "", json_encode($imgs));
