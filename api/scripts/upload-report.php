<?php
require_once "Config/Lite.php";
require_once('./lib/helper.php');

ini_set('max_execution_time', 300);

if(isset($_FILES['file']['name'])){
  $tccode = $_POST['tccode'];
  $repnum = sprintf('%03d', $_POST['repnum']);
  $uploadDir = "../resources/reports/".$tccode."/".$repnum;
  $draftDir = "../resources/reports/draft";

  // Make sure dir exists
  mkdir($uploadDir, 0777, true);

  /* Getting file name */
  $filename = $_FILES['file']['name'];
  $location = $uploadDir."/".$filename;
  // $location = "upload/".$filename;

  // Delete if file exists
  if (file_exists($location)) {
    unlink($location);
  }

  if(move_uploaded_file($_FILES['file']['tmp_name'], $location)){
    $cfg = new Config_Lite("../report.ini", LOCK_EX);
    $cfg->set("draft", "tccode", $tccode);
    $cfg->set("draft", "repnum", $repnum);
    $cfg->save();

    $response = $location;
  }
  // $response = $location;
  // $response = var_dump($_FILES);

  recursiveDelete($draftDir);
  mkdir($draftDir, 0755, true);

  $images = new Imagick();
  $images->setResolution(144, 144);
  $images->readImage($location);
  foreach($images as $i=>$image) {
    $image->setImageFormat("png");
    $num = sprintf("%03d", $i);
    $suff = uniqid();
    $image->writeImage($draftDir.'/'.$num.'-output-'.$suff.'.png');
  }

  echo $response;
  exit;
}
 
echo 0;

?>