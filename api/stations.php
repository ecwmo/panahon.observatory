<?php
include_once(__DIR__ . '/start.php');

use Carbon\Carbon;

header('Content-Type: application/json');

if (array_key_exists('24hr', $_GET)) {
    if ($_GET["type"] == "csv") {
        $stnObsFile = '../resources/station/stn_obs_24hr.csv';
        // output headers so that the file is downloaded rather than displayed
        header('Content-type: text/csv');
        header('Content-Disposition: attachment; filename="stn_obs_24hr.csv"');

        // do not cache the file
        header('Pragma: no-cache');
        header('Expires: 0');

        readfile($stnObsFile);
    } else {
        $stnObsFile = '../resources/station/stn_obs_24hr.json';
        $stnObsArr = json_decode(file_get_contents($stnObsFile), true);
        echo json_encode($stnObsArr);
    }
} elseif (array_key_exists('timestamp', $_GET)) {
    $tsFile = '../resources/station/stn_obs_timestamp.json';
    $ts = json_decode(file_get_contents($tsFile), true);
    echo json_encode($ts);
} elseif (array_key_exists('weather_conf', $_GET)) {
    $confFile = '../resources/station/weather.json';
    $conf = json_decode(file_get_contents($confFile), true);
    echo json_encode($conf);
} else {
    $tsFile = '../resources/station/stn_obs_timestamp.json';
    $ts = json_decode(file_get_contents($tsFile), true);
    $ts = Carbon::parse($ts['timestamp'])->setTime(0, 0, 0)->subDays(5);

    $stnObsFile = '../resources/station/stn_obs.json';
    $stnMOObsFile = '../resources/station/stn_mo_obs.json';

    $stnObsArr = json_decode(file_get_contents($stnObsFile), true);
    $stnMOObsArr = json_decode(file_get_contents($stnMOObsFile), true);
    $stnObsArr = array_merge($stnObsArr, $stnMOObsArr);

    $datArr = array('type' => "FeatureCollection", 'features' => array());

    foreach ($stnObsArr as $stnId => $stnObs) {
        $dat = array('type' => "Feature");
        $dat['geometry'] = array(
            'type' => "Point",
            'coordinates' => array($stnObs['lon'], $stnObs['lat'])
        );
        $dat['properties'] = $stnObs;
        $obsTS = Carbon::parse($stnObs['obs']['timestamp'])->setTime(0, 0, 0);
        if ($obsTS->greaterThanOrEqualTo($ts)) {
            array_push($datArr['features'], $dat);
        }
    }

    echo json_encode($datArr);
}
