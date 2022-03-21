<?php
    include_once(__DIR__.'/../config.php');

    $pages = array('reports' => "Extreme Weather Report");

    $curPage = basename($_SERVER['PHP_SELF']);

    function getTitle($curPage, $pages)
    {
        foreach ($pages as $pageName => $pageTitle) {
            if ($curPage == $pageName . '.php') {
                echo $pageTitle . " - ";
            }
        }
        echo "Weather and Climate Research - Manila Observatory";
    }

    function vite_assets()
    {
        $devServerIsRunning = false;
        $hostIP = $_ENV['HOST_IP'];
        $vitePort = $_ENV['VITE_PORT'];
        $subURL = $_ENV['APP_SUBURL'];

        if (strlen($subURL) > 0) {
            $subURL = "/{$subURL}";
        }

        if ($_ENV['APP_ENV'] == "local") {
            $url = "http://{$hostIP}:{$vitePort}/@vite/client";

            if (@file_get_contents($url, false, null, 0, 1)) {
                $devServerIsRunning = true;
            }
        }

        if ($devServerIsRunning) {
            return <<<HTML
            <script type="module" src="http://{$hostIP}:{$vitePort}/@vite/client"></script>
            <script type="module" src="http://{$hostIP}:{$vitePort}/src/main.ts"></script>
        HTML;
        }

        $manifest = json_decode(file_get_contents(
            LOCAL_PATH_ROOT. '/public/build/manifest.json'
        ), true);

        return <<<HTML
        <script type="module" src="{$subURL}/public/build/{$manifest['src/main.ts']['file']}"></script>
        <link rel="stylesheet" href="{$subURL}/public/build/{$manifest['src/main.ts']['css'][0]}">
    HTML;
    }
?>

<head>
  <title>
    <?php getTitle($curPage, $pages); ?>
  </title>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="Experimental model forecasts for the Philippine" />

  <link rel="shortcut icon" href="/resources/static/logo.png">

  <!-- FontAwesome -->
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.3/css/fontawesome.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.3/css/solid.min.css" />

  <!-- Mapbox -->
  <link href='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css' rel='stylesheet' />

  <?php echo vite_assets(); ?>
</head>
