<?php
$src = $_GET['src'];
$path    = './resources/reports/'.$src;
$files = scandir($path);

$files = array_diff(scandir($path), array('.', '..'));

echo json_encode($files);
?>