<?php
date_default_timezone_set("Asia/Manila");

$input = array("00", "01", "02", "03", "04");
$stdate = explode("\n",file_get_contents('../wwi-data/wrf/wrf_timestamps'));
$font = './arial.ttf';

for ($i=0; $i<5; $i++) {
$map = "$qmap".$input[$i];
$map = imagecreatetruecolor(400, 470);
$j = 0;

$c1 = imagecolorallocate($map, 255, 255, 255);
$c2 = imagecolorallocate($map, 230, 231, 236);
$c3 = imagecolorallocate($map, 206, 208, 217);
$c4 = imagecolorallocate($map, 182, 185, 198);
$c5 = imagecolorallocate($map, 158, 162, 179);
$c6 = imagecolorallocate($map, 134, 139, 161);
$c7 = imagecolorallocate($map, 110, 115, 142);
$c8 = imagecolorallocate($map, 86, 92, 123);
$c9 = imagecolorallocate($map, 62, 69, 104);
$c10 = imagecolorallocate($map, 38, 46, 85);
$c11 = imagecolorallocate($map, 14, 23, 67);

$blank = imagecolorallocate($map, 0, 0, 0);
imagecolortransparent($map, $blank);

  imagefill($map, 0, 0, $blank);
  $handle = fopen("../wwi-data/wrf/wrf".$input[$i].".csv", "r");
  while (($data = fgetcsv($handle, 30, ",")) !== FALSE) {
    $w = 4;
//    $x = floor(($data[1]*26.175)-2994.2);
//    $y = floor(574.66-($data[0]*26.165));
    $x = floor(($data[1]-114.3893)/0.0383);
    $y = floor(470-(($data[0]-4)/0.0383));
    switch (true) {
//      case $data[2] >= 10: imagesetpixel($map, $x, $y, $c11); break;
//      case $data[2] >= 9: imagesetpixel($map, $x, $y, $c10); break;
//      case $data[2] >= 8: imagesetpixel($map, $x, $y, $c9); break;
//      case $data[2] >= 7: imagesetpixel($map, $x, $y, $c8); break;
//      case $data[2] >= 6: imagesetpixel($map, $x, $y, $c7); break;
//      case $data[2] >= 5: imagesetpixel($map, $x, $y, $c6); break;
//      case $data[2] >= 4: imagesetpixel($map, $x, $y, $c5); break;
//      case $data[2] >= 3: imagesetpixel($map, $x, $y, $c4); break;
//      case $data[2] >= 2: imagesetpixel($map, $x, $y, $c3); break;
//      case $data[2] >= 1: imagesetpixel($map, $x, $y, $c2); break;
//      case $data[2] > 0: imagesetpixel($map, $x, $y, $c1); break;
	  
      case $data[2] >= 10: imagefilledellipse($map, $x, $y, $w, $w, $c11); break;
      case $data[2] >= 9: imagefilledellipse($map, $x, $y, $w, $w, $c10); break;
      case $data[2] >= 8: imagefilledellipse($map, $x, $y, $w, $w, $c9); break;
      case $data[2] >= 7: imagefilledellipse($map, $x, $y, $w, $w, $c8); break;
      case $data[2] >= 6: imagefilledellipse($map, $x, $y, $w, $w, $c7); break;
      case $data[2] >= 5: imagefilledellipse($map, $x, $y, $w, $w, $c6); break;
      case $data[2] >= 4: imagefilledellipse($map, $x, $y, $w, $w, $c5); break;
      case $data[2] >= 3: imagefilledellipse($map, $x, $y, $w, $w, $c4); break;
      case $data[2] >= 2: imagefilledellipse($map, $x, $y, $w, $w, $c3); break;
      case $data[2] >= 1: imagefilledellipse($map, $x, $y, $w, $w, $c2); break;
      case $data[2] > 0: imagefilledellipse($map, $x, $y, $w, $w, $c1); break;
    }
  }
  imagettftext($map,10,0,5,460,$c1,$font,$stdate[$i]);
  header('Content-type: image/png');
  imagepng($map, '../wwi-images/wrf'.$input[$i].'.png', 9, PNG_NO_FILTER);
  imagefill($map, 0, 0, $blank);
}


?>