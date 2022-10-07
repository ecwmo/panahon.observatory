<?php
include_once(__DIR__ . '/start.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$file = '../resources/model/info.json';
$info = file_get_contents($file);
$info = json_decode($info, true);

$imgs = [
    'jtwc' => 'https://www.metoc.navy.mil/jtwc/products/abpwsair.jpg',
    'pagasa' => 'https://pubfiles.pagasa.dost.gov.ph/climps/tcthreat/TC_Threat_and_S2S_Forecast.png'
];

$mod_img_dir = '../resources/model/img';
$hr_array = [24, 48, 72, 96, 120];
$file_prfxs = ['rain', 'rainx', 'wind', 'hix'];
$date_str = "{$info['year']}-{$info['month']}-{$info['day']}_{$info['hour']}PHT";
$mod_imgs = array_reduce($file_prfxs, fn ($c, $i) => array_merge($c, [$i => array_map(fn ($hr) => $mod_img_dir . "/wrf-" . $hr . "hr_" . $i . "_" . $date_str . ".png", $hr_array)]), []);
$imgs = array_merge($imgs, ['fcst' => $mod_imgs]);

$obs_img_dir = '../resources/model/img/ewb';
$day_array = [1, 3, 5, 7, 30];
$file_prfxs = ['gsmap', 'station'];
$obs_imgs = array_reduce($file_prfxs, fn ($c, $i) => array_merge($c, [$i => array_map(fn ($dy) => $obs_img_dir . "/" . $i . "_" .  $dy . "day_totalprecip_" . $date_str . ".png", $day_array)]), []);
$imgs = array_merge($imgs, ['obs' => $obs_imgs]);

echo str_replace("..", "", json_encode($imgs));
