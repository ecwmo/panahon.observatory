<?php
require_once "Config/Lite.php";

$baseDir = "./resources/reports";

if (isset($_GET['code']) && isset($_GET['repnum'])) {
    $tccode = $_GET['code'];
    $repnum = sprintf('%03d', $_GET['repnum']);
    $path = $baseDir."/".$tccode."/".$repnum."/img";
} elseif (isset($_GET['src'])) {
    if ($_GET['src'] == "draft") {
        $path = $baseDir."/draft";
    } else if ($_GET['src'] == "static") {
        $path = $baseDir."/static";
    }
} else {
    $cfg = new Config_Lite("report.ini", LOCK_EX);
    $tccode = $cfg->get("draft", "tccode");
    $repnum = $cfg->get("draft", "repnum");
    $path = $baseDir."/".$tccode."/".$repnum."/img";
}

$files = scandir($path);

$files = array_diff(scandir($path), array('.', '..'));

// echo $path;
// $files = array_walk($files, function(&$value, $key) { $value .= "d"; } );
$dat = [
    "path" => $path,
    "img" => $files
];

echo json_encode($dat);
?>