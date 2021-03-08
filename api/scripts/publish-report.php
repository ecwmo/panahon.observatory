<?php
require_once "Config/Lite.php";
require_once('./lib/helper.php');

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

$cfg = new Config_Lite("../report.ini", LOCK_EX);
$tccode = $cfg->get("draft", "tccode");
$repnum = $cfg->get("draft", "repnum");

$srcDir = "../resources/reports/draft";
$destDir = "../resources/reports/".$tccode."/".$repnum."/img";

mkdir($destDir, 0755, true);
recursiveDelete($destDir);
xcopy($srcDir, $destDir);

$cfg->set("public", "tccode", $tccode);
$cfg->set("public", "repnum", $repnum);
$cfg->save();

$src = '../resources/reports/draft';
$dest = '../resources/reports/public';

$ssrc = '../resources/reports/sdraft';
$sdest = '../resources/reports/static';

recursiveDelete($dest);
xcopy($src, $dest);

recursiveDelete($sdest);
xcopy($ssrc, $sdest);

echo 'Success!!!';

?>