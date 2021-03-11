<?php 

function getTitle($curPage, $pages)
{
  $npage = count($pages);
  for ($p = 0; $p < $npage; $p++) {
    if ($curPage == $pages[$p][0] . '.php') {
      return $pages[$p][3];
    }
  }
  return "Weather Watch Initiative - Manila Observatory";
}

$curPage = basename($_SERVER['PHP_SELF']);
$curStyle = './wwi-styles/' . str_replace(".php", ".css", $curPage);
$curScript = './wwi-scripts/' . str_replace(".php", ".js", $curPage);

if ($_GET['view']=="draft") {
  $imgSrc = "draft";
  $simgSrc = "sdraft";
} else {
  $imgSrc = "public";
  $simgSrc = "static";
}

?>

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="Experimental model forecasts for the Philippine" />

  <link href="./dist/styles.css" rel="stylesheet" type="text/css" />

  <title><?php getTitle($curPage, $pages); ?></title>
</head>