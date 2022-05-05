<?php
  include_once(__DIR__.'/../start.php');

  $file = '../resources/model/info.json';
  $info = file_get_contents($file);
  $info = json_decode($info, true);

  $file = "../resources/model/forecast_{$info['year']}-{$info['month']}-{$info['day']}_{$info['hour']}PHT.json";
  $data = file_get_contents($file);
  $obj = json_decode($data, true);

  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  echo json_encode($obj);
