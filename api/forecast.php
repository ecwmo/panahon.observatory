<?php
include_once(__DIR__ . '/start.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$ROOT_DIR = '../resources/model';

$file = $ROOT_DIR . '/info.json';
$info = file_get_contents($file);
$info = json_decode($info, true);

if (isset($_GET['img'])) {
    if ($_GET['img'] == "2") {
        $imgDir = $ROOT_DIR . '/web_img';
        $globPattern = "/*{$info['year']}-{$info['month']}-{$info['day']}_{$info['hour']}*.png";
        $imgs = glob($imgDir . $globPattern, GLOB_BRACE);

        $cmapImgSrc = $imgDir . '/cmap';
        $cmapImgs = glob($cmapImgSrc . '/*.png', GLOB_BRACE);

        $data = [
            "imgs" => $imgs,
            "cmaps" => $cmapImgs
        ];

        echo str_replace("..", "", json_encode($data));
    } else {
        $imgDir = $ROOT_DIR . '/img';
        $globPattern = "/*{$info['year']}-{$info['month']}-{$info['day']}_{$info['hour']}*.png";
        $imgs = glob($imgDir . $globPattern, GLOB_BRACE);

        echo str_replace("..", "", json_encode($imgs));
    }
} else {
    $file = $ROOT_DIR . "/forecast_{$info['year']}-{$info['month']}-{$info['day']}_{$info['hour']}PHT.json";
    $data = file_get_contents($file);
    $obj = json_decode($data, true);

    echo json_encode($obj);
}
