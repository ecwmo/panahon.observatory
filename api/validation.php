<?php
include_once(__DIR__ . '/start.php');

use Carbon\Carbon;

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$mod_img_dir = '../resources/model/img';
$val_img_dir = '../resources/validation';
$glob_pattern = "/wrf_ensmean-gsmap-24hr_rain_day1_*.png";
$imgs = glob($val_img_dir . $glob_pattern, GLOB_BRACE);

function parse_date(string $file_name)
{
    preg_match('/[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}/', basename($file_name), $date_str);
    $ts = Carbon::createFromFormat('Y-m-d_H', $date_str[0], 'Asia/Manila');
    return $ts;
}

if (isset($_GET['dates'])) {
    $date_arr = array_map('parse_date', $imgs);
    sort($date_arr);
    $file_sfxs = array_map(fn ($ts) => $ts->format('Y-m-d'), array_reverse($date_arr));
    echo str_replace("..", "", json_encode($file_sfxs));
} else {
    if (isset($_GET['dt']) && !empty($_GET['dt'])) {
        $ts = Carbon::createFromFormat('Y-m-d_H', $_GET['dt'] . "_08", 'Asia/Manila');
    } else {
        $ts = parse_date(basename(end($imgs)));
    }

    $file_names = [];

    $day_array = [5, 4, 3, 2, 1];

    $file_name_gen = function (string $img_dir, string $file_pfx, array $file_sfxs) {
        $file_names = [];
        foreach ($file_sfxs as $fsfx) {
            $fname = $img_dir . '/' . $file_pfx  . $fsfx;
            if (file_exists($fname)) {
                array_push($file_names, $fname);
            } else {
                array_push($file_names, NULL);
            }
        }
        return $file_names;
    };

    $file_prfxs = ['wrf', 'wrf_run1', 'wrf_run2', 'wrf_run3'];
    $file_sfxs = array_map(fn ($dy) => '-' . ($dy) * 24 . 'hr_rain_' . $ts->copy()->subDays($dy - 1)->format('Y-m-d_H') . 'PHT.png', $day_array);
    $file_names = array_reduce($file_prfxs, fn ($c, $i) => array_merge($c, [$i => $file_name_gen($mod_img_dir, $i,  $file_sfxs)]), []);

    $file_prfxs = ['gsmap'];
    $file_sfxs = ['-24hr_rain_' . $ts->copy()->format('Y-m-d_H') . 'PHT.png'];
    $file_names = array_reduce($file_prfxs, fn ($c, $i) => array_merge($c, [$i => $file_name_gen($val_img_dir, $i,  $file_sfxs)]), $file_names);

    $file_prfxs = ['gfs', 'wrf_ensmean-gsmap', 'wrf_run1-gsmap', 'wrf_run2-gsmap', 'wrf_run3-gsmap', 'gfs-gsmap'];
    $file_sfxs = array_map(fn ($dy) => '-24hr_rain_day' . $dy . '_' . $ts->copy()->subDays($dy - 1)->format('Y-m-d_H') . 'PHT.png', $day_array);
    $file_names = array_reduce($file_prfxs, fn ($c, $i) => array_merge($c, [str_replace('-', '_', $i) => $file_name_gen($val_img_dir, $i,  $file_sfxs)]), $file_names);

    echo str_replace("..", "", json_encode($file_names));
}
