<?php
    include_once(__DIR__ . '/../start.php');

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

<!DOCTYPE html>

<head lang="en">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Panahon - Manila Observatory</title>
    <meta name="description" content="Panahon - Manila Observatory">
    <link rel="icon" href="/resources/static/img/logo/favicon-32x32.png" type="image/png" sizes="32x32">
    <link rel="alternate icon" href="/resources/static/img/logo/favicon-16x16.png" type="image/png" sizes="16x16">
    <link rel="apple-touch-icon" href="/resources/static/img/logo/apple-touch-icon.png" sizes="180x180">
    <link rel="mask-icon" href="/resources/static/img/logo/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="theme-color" content="#ffffff">
    <link rel="manifest" href="/dist/manifest.webmanifest">

    <?php echo vite_assets(); ?>
</head>
