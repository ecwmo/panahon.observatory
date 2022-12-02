<?php
include_once(__DIR__ . '/start.php');

use Carbon\Carbon;

header('Content-Type: application/json');

function parse_validation_date(string $file_name)
{
    preg_match('/[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}/', basename($file_name), $date_str);
    $tsPHT = Carbon::createFromFormat('Y-m-d_H', $date_str[0], 'Asia/Manila');
    return $tsPHT;
}

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
    if (array_key_exists('validation', $_GET)) {
        $valImgDir = "../resources/validation";
        $valStnFile = $valImgDir . '/stations_lufft.json';
        $stnArr = json_decode(file_get_contents($valStnFile), true);

        $globPattern = "/wrf_ensmean-gsmap-24hr_rain_day1_*.png";
        $imgs = glob($valImgDir . $globPattern, GLOB_BRACE);

        if (isset($_GET['dt']) && !empty($_GET['dt'])) {
            $tsPHT = Carbon::createFromFormat('Y-m-d_H', $_GET['dt'] . "_08", 'Asia/Manila');
        } else {
            $tsPHT = parse_validation_date(basename(end($imgs)));
        }
    } else {
        $tsFile = '../resources/station/stn_obs_timestamp.json';
        $tsPHT = json_decode(file_get_contents($tsFile), true);
        $tsPHT = Carbon::parse($ts['timestamp'])->setTime(0, 0, 0)->subDays(5);

        $stnObsFile = '../resources/station/stn_obs.json';
        $stnMOObsFile = '../resources/station/stn_mo_obs.json';

        $stnObsArr = json_decode(file_get_contents($stnObsFile), true);
        $stnMOObsArr = json_decode(file_get_contents($stnMOObsFile), true);
        $stnArr = array_merge($stnObsArr, $stnMOObsArr);
    }

    $datArr = array('type' => "FeatureCollection", 'features' => array());

    foreach ($stnArr as $stnId => $stn) {
        $dat = array('type' => "Feature");
        $dat['geometry'] = array(
            'type' => "Point",
            'coordinates' => array($stn['lon'], $stn['lat'])
        );
        if (array_key_exists('info', $_GET)) {
            $dat['properties'] = array_filter($stn, fn ($item) => in_array($item, ['id', 'name', 'lat', 'lon', 'elevation', 'address']), ARRAY_FILTER_USE_KEY);
        } elseif (array_key_exists('validation', $_GET)) {
            $imgFile = "/validation_aws_combined_" . str_replace(' ', '_', $stn['name']) . '_' . $tsPHT->format('Y-m-d_H') . "PHT.png";
            $dat['properties'] = array_merge($stn, ["id" => $stn['name'], "tsImg" => $valImgDir . $imgFile]);
        } else {
            $dat['properties'] = $stn;
        }
        $obsTS = Carbon::parse($stn['obs']['timestamp'])->setTime(0, 0, 0);
        if ($obsTS->greaterThanOrEqualTo($tsPHT)) {
            array_push($datArr['features'], $dat);
        }
    }

    echo json_encode($datArr);
}
