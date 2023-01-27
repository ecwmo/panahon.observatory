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
$mod_img_dir2 = "../resources/model/img";
$mod_imgs2 = ['ari' => array_map(fn ($hr) => $mod_img_dir2 . "/wrf-" . $hr . "hr_ari_" . $date_str . ".png", $hr_array)];
$mod_imgs = array_merge($mod_imgs, $mod_imgs2);
$imgs = array_merge($imgs, ['fcst' => $mod_imgs]);

$ewb_img_dir = '../resources/model/img/ewb';

$day_array = [1, 3, 5];
$file_frag = ['rain' => 'totalprecip', 'rainx' => 'totalprecip_extreme'];
$mod_imgs = array_reduce(array_keys($file_frag), fn ($c, $i) => array_merge($c, [$i => array_map(fn ($dy) => $ewb_img_dir . "/wrf-" .  $dy . "day_". $file_frag[$i] ."_" . $date_str . ".png", $day_array)]), []);
$imgs = array_merge($imgs, ['fcstAccum' => $mod_imgs]);

$tsPHT = get_latest_date("ewb");
$date_str = $tsPHT->format('Y-m-d_H') . "PHT";

$day_array = [1, 3, 5, 7, 30];
$file_prfxs = ['gsmap', 'station'];
$obs_imgs = array_reduce($file_prfxs, fn ($c, $i) => array_merge($c, [$i => array_map(fn ($dy) => $ewb_img_dir . "/" . $i . "_" .  $dy . "day_totalprecip_" . $date_str . ".png", $day_array)]), []);
$obs_imgs2 = ['gsmapx' => array_map(fn ($dy) => $ewb_img_dir . "/gsmap_" .  $dy . "day_totalprecip_extreme_" . $date_str . ".png", $day_array)];
$obs_imgs = array_merge($obs_imgs, $obs_imgs2);
$imgs = array_merge($imgs, ['obs' => $obs_imgs]);

echo str_replace("..", "", json_encode($imgs));
