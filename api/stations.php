<?php

$stn_file = '../resources/station/stn_map_ph.json';
$stn_obs_file = '../resources/station/stn_obs.json';
$timestamp_file = '../resources/station/stn_obs_timestamp.json';

$stn_arr = json_decode(file_get_contents($stn_file), true);
$stn_obs_arr = json_decode(file_get_contents($stn_obs_file), true);

$ts = json_decode(file_get_contents($timestamp_file), true);

$dat_arr = array();

foreach ($stn_obs_arr as $stn_id => $stn_obs) {
    $dat = $stn_arr[$stn_id];
    $dat['obs'] = $stn_obs;
    $dat['obs']['timestamp'] = $ts['timestamp'];
    array_push($dat_arr, $dat);
}

header('Content-Type: application/json');
echo json_encode($dat_arr);
