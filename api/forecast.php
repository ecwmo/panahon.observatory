<?php
include_once(__DIR__ . '/start.php');
include_once(__DIR__ . '/helper.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$mod_img_dir = '../resources/model';

$tsPHT = get_latest_date();
$tsUTC = $tsPHT->copy()->tz('UTC');

if (isset($_GET['img'])) {
    if ($_GET['img'] == "2") {
        $imgDir = $mod_img_dir . '/web_img';
        $globPattern = "/*" . $tsPHT->format('Y-m-d_H') . "*.png";
        $imgs = glob($imgDir . $globPattern, GLOB_BRACE);

        $cmapImgSrc = $imgDir . '/cmap';
        $cmapImgs = glob($cmapImgSrc . '/*.png', GLOB_BRACE);

        $data = [
            "imgs" => $imgs,
            "cmaps" => $cmapImgs
        ];

        echo str_replace("..", "", json_encode($data));
    } else {
        $imgDir = $mod_img_dir . "/img/24hrly/" . $tsUTC->format('Ymd/H');
        $globPattern = "/*.png";
        $imgs = glob($imgDir . $globPattern, GLOB_BRACE);

        $imgDir = $mod_img_dir . "/img";
        $globPattern = "/wrf-ts_" . $tsPHT->format('Y-m-d_H') . "PHT.png";
        $imgs2 = glob($imgDir . $globPattern, GLOB_BRACE);

        echo str_replace("..", "", json_encode(array_merge($imgs, $imgs2)));
    }
} else {
    $file = $mod_img_dir . "/forecast_" . $tsPHT->format('Y-m-d_H') . "PHT.json";
    $data = file_get_contents($file);
    $obj = json_decode($data, true);

    echo json_encode($obj);
}
