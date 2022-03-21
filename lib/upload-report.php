<?php
require_once 'Config/Lite.php';
require_once(__DIR__.'/helper.php');
require_once(__DIR__.'/../start.php');

ini_set('max_execution_time', 300);

if (isset($_POST['upload']) && isset($_FILES['report']['name'])) {
    $formStatus = 'loading';
    try {
        $reportFile = $_FILES['report'];
        $reportFilename = $reportFile['name'];

        $tccode = $_POST['tccode'];
        $repnum = sprintf('%03d', $_POST['reportnum']);
        $uploadDir = RES_REPORTS_DIR.'/'.$tccode.'/'.$repnum;
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
            $cfg = new Config_Lite(RES_REPORTS_DIR.'/report.ini', LOCK_EX);
            $cfg->set('draft', 'tccode', $tccode);
            $cfg->set('draft', 'reportnum', $repnum);
            $cfg->save();
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

        header('Content-Type: application/json');
        echo json_encode('success');
    } catch (Exception $e) {
        echo $e;
    }
}
