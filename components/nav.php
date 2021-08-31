<?php

$pages = array(
    array("index", "Latest Summaries - Weather Conditions and Maps", "Quick View", "Weather Watch Initiative - Manila Observatory"),
    // array("stations", "Observation Stations - Graphs and Information", "Stations", "Observation Stations - Weather Watch Initiative (Manila Observatory)"),
    array("models", "Model Results - Forecasts and Maps", "Models", "Experimental Model Forecasts - Weather Watch Initiative (Manila Observatory)"),
    // array("satellites", "Remote Sensing - Satellite Images", "Satellites", "Satellite Maps - Weather Watch Initiative (Manila Observatory)"),
    array("climate", "Philippine Climate Information", "Climate", "Philippine Climate - Weather Watch Initiative (Manila Observatory)"),
    array("reports", "Tropical Cyclone Report", "Reports", "Tropical Cyclone - Weather Watch Initiative (Manila Observatory)")
);

$pages2 = array(
    array("faq", "Frequently Asked Questions", "FAQ", "FAQ - Weather Watch Initiative - Manila Observatory")
);

function buildMenu($curPage, $pages, $class0)
{
    $npage = count($pages);
    for ($p = 0; $p < $npage; $p++) {
        $href = '/' . $pages[$p][0] . '.php';
        if ($curPage == $pages[$p][0] . '.php') {
            $class = $class0 . 'text-gray-100 bg-blue-600';
        } else {
            $class = $class0;
        }
        echo '<li class="' . $class . '"><a href="' . $href . '" title="' . $pages[$p][1] . '">' . $pages[$p][2] . '</a></li>';
    }
}

function buildRMenu($curPage, $pages, $class0)
{
    if (isset($_SESSION['username'])) {
        $href = "/auth/logout.php";
        echo '<li class="' . $class0 . '"><a href="' . $href . '" title="Logout">Logout</a></li>';
    }
    $npage = count($pages);
    for ($p = 0; $p < $npage; $p++) {
        $href = '/' . $pages[$p][0] . '.php';
        if ($curPage == $pages[$p][0] . '.php') {
            $class = $class0 . 'text-gray-100 bg-blue-600';
        } else {
            $class = $class0;
        }
        echo '<li class="' . $class . '"><a href="' . $href . '" title="' . $pages[$p][1] . '">' . $pages[$p][2] . '</a></li>';
    }
}

?>
<nav class="flex justify-between md:w-full flex-wrap md:flex-no-wrap" x-data="{mobileMenuOpen : false}">
    <div class="flex justify-end items-center w-full" @click.outside="mobileMenuOpen = false">
        <button @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden my-auto mr-2 w-8 h-8 bg-gray-200 text-gray-600 p-1">
            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"></path>
            </svg>
        </button>
    </div>

    <div class="absolute right-0 top-16 md:top-0 md:relative border border-b-0 md:border-l-0 md:border-r-0 border-black md:flex flex-col md:flex-row md:w-full justify-between bg-blue-900"
        :class="{ 'hidden': !mobileMenuOpen }">
        <ul class="md:flex flex-col md:flex-row">
            <?php buildMenu($curPage, $pages, "py-1 px-2 border-b md:border-r md:border-b-0 border-black text-gray-300 uppercase hover:text-gray-100 hover:bg-blue-600"); ?>
        </ul>
        <ul class="md:flex flex-col md:flex-row border-t md:border-t-0 md:border-l-0 border-black">
            <?php buildRMenu($curPage, $pages2, "py-1 px-2 border-b md:border-l md:border-b-0 border-black text-gray-300 uppercase hover:text-gray-100 hover:bg-blue-600"); ?>
        </ul>
    </div>
</nav>