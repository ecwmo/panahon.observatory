<!doctype html>
<html lang="en">
<?php include_once('./components/head.php'); ?>

<?php
    require_once 'Config/Lite.php';
    $cfg = new Config_Lite(RES_REPORTS_DIR.'/report.ini', LOCK_EX);

    $ROOT_IMG_DIR = './resources/reports';
    if ($_GET['view']=="draft") {
        $imgSrc = $ROOT_IMG_DIR.'/img/draft';
        $simgSrc = $ROOT_IMG_DIR.'/img/sdraft';
    } else {
        $tccode = $cfg->get("public", "tccode");
        $repnum = $cfg->get("public", "reportnum");
        $imgSrc = $ROOT_IMG_DIR.'/'.$tccode .'/'.$repnum .'/img';
        $simgSrc = $ROOT_IMG_DIR.'/img/static';
    }
    $reportImgs = glob($imgSrc  .'/*.{jpg,png}', GLOB_BRACE);
    $reportSImgs = glob($simgSrc  .'/*.{jpg,png}', GLOB_BRACE);

    if (array_key_exists('new', $_GET)) {
        header("Location: /new-report.php");
    }
    if (array_key_exists('publish', $_GET)) {
        header("Location: /new-report.php?uploaded");
    }
?>

<body class="bg-gray-600 w-full md:w-4/5 mx-auto">
    <?php include_once('./components/header.php'); ?>
    <div class="bg-gray-300 border-l border-r border-b border-black flex flex-col" x-data="reportCtrl(<?php alpine($reportImgs); ?>, <?php alpine($reportSImgs); ?>)">
        <div class="m-6 space-y-6">
            <template x-for="(img, idx) in imgSrcs.reportImgs">
                <img 
                    class="border border-black shadow-md rounded-2xl"
                    x-intersect="loadImage('reportImgs', idx)"
                    :src="img.show ? img.imgSrc : ''"
                    />
            </template>
        </div>
        <?php 
            if(count($reportSImgs) > 0) { 
        ?>
        <div class="mx-6 border border-black shadow-md rounded-2xl bg-white">
            <h1 class="p-3 text-5xl font-bold">Additional Information</h1>
        </div>
        <div class="m-6 space-y-6">
            <template x-for="(img, idx) in imgSrcs.staticImgs">
                <img 
                    class="border border-black shadow-md rounded-2xl"
                    x-intersect="loadImage('staticImgs', idx)"
                    :src="img.show ? img.imgSrc : ''"
                    />
            </template>
        </div>
        <?php } ?>
    </div>

    <!-- Main Script -->
    <script src="dist/main.js" type="text/javascript"></script>
</body>

</html>