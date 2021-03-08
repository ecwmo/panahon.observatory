<?php
chdir(dirname(__FILE__));
// <head>
$title  = '  <title>Weather Watch Initiative - Manila Observatory</title>';
$meta   = '  <meta name="description" content="Local Philippine weather as processed by the Manila Observatory"/>'."\n".
          '  <meta charset="UTF-8"/>';
$style  = '  <link href="./wwi-styles/led.css" rel="stylesheet" type="text/css"/>'."\n";
$script = '  <script src="./wwi-scripts/main.js" type="text/javascript"></script>';

$head   = '<head>'."\n".$title."\n".$meta."\n".$style."\n".$script."\n".'</head>';
// <body>
  $srain = '';
  $sracc = '';
  $stmp = '';
  $row = 1;
  if (($handle = fopen('../wwi/data-met/latest.csv', 'r')) !== FALSE) {
    while (($data = fgetcsv($handle, 150, ',')) !== FALSE) {
      $row++;
      if ($data[0] == 'MOIP') {
        $content = $data[4];
      }
    }
    fclose($handle);
  }

$logo = '<img alt="Manila Observatory Logo" class="mo-logo" src="./wwi-images/mo_logo_bw.gif"/>';
$temperature = '<div class="temperature">'."\n".$content."\n".'</div>';

$body = '<body id="root-node">'."\n".$logo."\n".$temperature."\n".'</body>';
// led.html output
$wwi = '<!DOCTYPE html>'."\n".'<html>'."\n".$head."\n".$body."\n".'</html>';
$output = fopen('../led.html', 'w');
fwrite($output, $wwi);
fclose($output);
?>