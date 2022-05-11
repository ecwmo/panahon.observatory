<?php
require_once(__DIR__.'/helper.php');
require_once(__DIR__.'/../start.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

ini_set('max_execution_time', 300);

if (isset($_POST['upload']) && isset($_FILES['report']['name'])) {
    $formStatus = 'loading';
    try {
        $reportFile = $_FILES['report'];
        $reportFilename = $reportFile['name'];

        $repCode = $_POST['repcode'];
        $repNum = sprintf('%03d', $_POST['reportnum']);
        $uploadDir = RES_REPORTS_DIR.'/'.$repCode.'/'.$repNum;
        $imgDraftDir = RES_REPORTS_DIR.'/img/draft';
        $imgDir = $uploadDir.'/img';
        $reportLocalPath = $uploadDir.'/'.$reportFilename;

        // Prepare directories
        mkdir($uploadDir, 0777, true);
        recursiveDelete($imgDraftDir);
        mkdir($imgDraftDir, 0755, true);
        recursiveDelete($imgDir);
        mkdir($imgDir, 0755, true);
        if (file_exists($reportLocalPath)) {
            unlink($reportLocalPath);
        }

        if (move_uploaded_file($reportFile['tmp_name'], $reportLocalPath)) {
            $file = RES_REPORTS_DIR.'/report.json';
            $info = file_get_contents($file);
            $info = json_decode($info, true);

            $info['draft']['repcode'] = $repCode;
            $info['draft']['reportnum'] = $repNum;
            file_put_contents($file, json_encode($info));
        }

        $images = new imagick();
        $images->setResolution(144, 144);
        $images->readImage($reportLocalPath);
        foreach ($images as $i=>$image) {
            // $image->setImageFormat('png');
            $num = sprintf('%03d', $i);
            $suff = uniqid();
            $image->writeImage($imgDraftDir.'/'.$num.'-output-'.$suff.'.jpg');
            // $image->writeImage($imgDir.'/'.$num.'-output-'.$suff.'.png');
        }

        xcopy($imgDraftDir, $imgDir);

        echo json_encode('success');
    } catch (Exception $e) {
        echo $e;
    }
} elseif (isset($_POST['publish'])) {
    $file = RES_REPORTS_DIR.'/report.json';
    $info = file_get_contents($file);
    $info = json_decode($info, true);

    $info['public']['repcode'] = $info['draft']['repcode'];
    $info['public']['reportnum'] = $info['draft']['reportnum'];
    file_put_contents($file, json_encode($info));

    echo json_encode('success');
} else {
    $ROOT_IMG_DIR = '../resources/reports';
    if ($_GET['view']=="draft") {
        $imgSrc = $ROOT_IMG_DIR.'/img/draft';
        $simgSrc = $ROOT_IMG_DIR.'/img/sdraft';
    } else {
        $file = RES_REPORTS_DIR.'/report.json';
        $info = file_get_contents($file);
        $info = json_decode($info, true);
        $repCode = $info['public']['repcode'];
        $repNum = $info['public']['reportnum'];
        $imgSrc = $ROOT_IMG_DIR.'/'.$repCode .'/'.$repNum .'/img';
        $simgSrc = $ROOT_IMG_DIR.'/img/static';
    }
    $reportImgs = glob($imgSrc  .'/*.{jpg,png}', GLOB_BRACE);
    $reportSImgs = glob($simgSrc  .'/*.{jpg,png}', GLOB_BRACE);

    $data = [
        "reportImgs" => $reportImgs,
        "staticImgs" => $reportSImgs
    ];

    echo str_replace("..", "", json_encode($data));
}
