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

?>