<?php
    include_once(__DIR__.'/../start.php');

    $json = file_get_contents('php://input');
    $data = json_decode($json);

    if ($data->token == 'mapbox') {
        header('Content-Type: application/json');
        echo json_encode($_ENV['MAPBOX_TOKEN']);
    }
