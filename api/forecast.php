<?php

$file = '../resources/model/forecast_latest.json';

$data = file_get_contents($file);

$obj = json_decode($data, true);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
echo json_encode($obj);
