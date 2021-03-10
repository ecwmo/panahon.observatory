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
      $class = "nav-item active";
    } else {
      $class = "nav-item";
    }
    echo '<li class="' . $class . '"><a class="nav-link" href="' . $href . '" title="' . $pages[$p][1] . '">' . $pages[$p][2] . '</a></li>';
  }
}

?>