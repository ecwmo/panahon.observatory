<?php
require_once "Config/Lite.php";
require_once(__DIR__.'/helper.php');
require_once(__DIR__.'/../start.php');

if (isset($_POST['publish'])) {
    $cfg = new Config_Lite(RES_REPORTS_DIR.'/report.ini', LOCK_EX);
    $tccode = $cfg->get("draft", "tccode");
    $repnum = $cfg->get("draft", "reportnum");

    $cfg->set("public", "tccode", $tccode);
    $cfg->set("public", "reportnum", $repnum);
    $cfg->save();

    header('Content-Type: application/json');
    echo json_encode('success');
}
