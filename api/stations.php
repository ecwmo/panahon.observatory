<?php

header('Content-Type: application/json');

if (array_key_exists('24hr', $_GET)) {
    if ($_GET["type"]=="csv") {
        $stn_obs_file = '../resources/station/stn_obs_24hr.csv';
        // output headers so that the file is downloaded rather than displayed
        header('Content-type: text/csv');
        header('Content-Disposition: attachment; filename="stn_obs_24hr.csv"');

        // do not cache the file
        header('Pragma: no-cache');
        header('Expires: 0');

        readfile($stn_obs_file);
    } else {
        $stn_obs_file = '../resources/station/stn_obs_24hr.json';
        $stn_obs_arr = json_decode(file_get_contents($stn_obs_file), true);
        echo json_encode($stn_obs_arr);
    }
} elseif (array_key_exists('timestamp', $_GET)) {
    $timestamp_file = '../resources/station/stn_obs_timestamp.json';
    $ts = json_decode(file_get_contents($timestamp_file), true);
    echo json_encode($ts);
} else {
    $stn_file = '../resources/station/stn_map_ph.json';
    $stn_obs_file = '../resources/station/stn_obs.json';
    $stn_mo_obs_file = '../resources/station/stn_mo_obs.json';
    $timestamp_file = '../resources/station/stn_obs_timestamp.json';

    $stn_arr = json_decode(file_get_contents($stn_file), true);
    $stn_obs_arr = json_decode(file_get_contents($stn_obs_file), true);
    $stn_mo_obs_arr = json_decode(file_get_contents($stn_mo_obs_file), true);
    $stn_obs_arr = array_merge($stn_obs_arr, $stn_mo_obs_arr);

    $ts = json_decode(file_get_contents($timestamp_file), true);

    $dat_arr = array();

    foreach ($stn_obs_arr as $stn_id => $stn_obs) {
        $dat = $stn_arr[$stn_id];
        $dat['obs'] = $stn_obs;
        $dat['obs']['timestamp'] = $ts['timestamp'];
        array_push($dat_arr, $dat);
    }

    echo json_encode($dat_arr);
}
