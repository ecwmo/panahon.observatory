<?php
include_once(__DIR__ . '/start.php');
include_once(__DIR__ . '/helper.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$imgs = [
    'jtwc' => 'https://www.metoc.navy.mil/jtwc/products/abpwsair.jpg',
    'pagasa' => 'https://pubfiles.pagasa.dost.gov.ph/climps/tcthreat/TC_Threat_and_S2S_Forecast.png'
];

$hr_array = [24, 48, 72, 96, 120];
$file_prfxs = ['rain', 'rainx', 'wind', 'hix'];

$tsPHT = get_latest_date();
$tsUTC = $tsPHT->copy()->tz('UTC');
$mod_img_dir = "../resources/model/img/24hrly/" . $tsUTC->format('Ymd/H');
$date_str = $tsPHT->format('Y-m-d_H') . "PHT";
$mod_imgs = array_reduce($file_prfxs, fn ($c, $i) => array_merge($c, [$i => array_map(fn ($hr) => $mod_img_dir . "/wrf-" . $hr . "hr_" . $i . "_" . $date_str . ".png", $hr_array)]), []);
$imgs = array_merge($imgs, ['fcst' => $mod_imgs]);


$tsPHT = get_latest_date("ewb");
$obs_img_dir = '../resources/model/img/ewb';
$day_array = [1, 3, 5, 7, 30];
$file_prfxs = ['gsmap', 'station'];
$date_str = $tsPHT->format('Y-m-d_H') . "PHT";
$obs_imgs = array_reduce($file_prfxs, fn ($c, $i) => array_merge($c, [$i => array_map(fn ($dy) => $obs_img_dir . "/" . $i . "_" .  $dy . "day_totalprecip_" . $date_str . ".png", $day_array)]), []);
$imgs = array_merge($imgs, ['obs' => $obs_imgs]);

echo str_replace("..", "", json_encode($imgs));
