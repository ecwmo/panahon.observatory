<?php
require_once('./lib/helper.php');

ini_set('max_execution_time', 300);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (isset($_GET['doc'])) {
  $doc = './resources/reports/'.$_GET['doc'];
  $dest = './resources/reports/draft';
  recursiveDelete($dest);
  mkdir($dest, 0755, true);

  $images = new Imagick();
  $images->setResolution(144, 144);
  $images->readImage($doc);
  foreach($images as $i=>$image) {
    $image->setImageFormat("png");
    $num = sprintf("%03d", $i);
    $suff = uniqid();
    $image->writeImage($dest.'/'.$num.'-output-'.$suff.'.png');
  }
  echo 'Success!!!';
} else if (isset($_GET['sdoc'])) {
  $doc = './resources/reports/'.$_GET['sdoc'];
  $dest = './resources/reports/sdraft';
  recursiveDelete($dest);
  mkdir($dest, 0755, true);

  $images = new Imagick();
  $images->setResolution(144, 144);
  $images->readImage($doc);
  foreach($images as $i=>$image) {
    $image->setImageFormat("png");
    $num = sprintf("%03d", $i);
    $suff = uniqid();
    $image->writeImage($dest.'/'.$num.'-output-'.$suff.'.png');
  }
  echo 'Success!!!';
}

?>