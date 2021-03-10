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

function buildMenu($curPage, $pages)
{
  $npage = count($pages);
  for ($p = 0; $p < $npage; $p++) {
    $href = './' . $pages[$p][0] . '.php';
    if ($curPage == $pages[$p][0] . '.php') {
      $class = "bg-blue-600";
    } else {
      $class = "";
    }
    echo '<li class="py-1 px-2 border-r border-black uppercase hover:bg-blue-600 ' . $class . '"><a href="' . $href . '" title="' . $pages[$p][1] . '">' . $pages[$p][2] . '</a></li>';
  }
}

?>