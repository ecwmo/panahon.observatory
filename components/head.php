<?php
    include_once(__DIR__ . '/../start.php');

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
            LOCAL_PATH_ROOT. '/dist/manifest.json'
        ), true);

        return <<<HTML
        <link rel="stylesheet" href="{$subURL}/dist/{$manifest['src/main.ts']['css'][0]}" />
        <script type="module" src="{$subURL}/dist/{$manifest['src/main.ts']['file']}"></script>
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
  <meta name="description" content="Panahon - Manila Observatory" />

  <link rel="shortcut icon" href="/resources/static/logo.png">

  <?php echo vite_assets(); ?>
</head>
