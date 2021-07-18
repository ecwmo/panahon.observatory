<!doctype html>
<html lang="en">
<?php include_once('./components/head.php'); ?>

<?php
    if (array_key_exists('new', $_GET)) {
        header("Location: /new-report.php");
    }
    if (array_key_exists('publish', $_GET)) {
        header("Location: /new-report.php?uploaded");
    }
?>

<body class="bg-gray-600 w-full md:w-4/5 mx-auto">
    <?php include_once('./components/header.php'); ?>
    <div class="bg-gray-300 border-l border-r border-b border-black flex flex-col" x-data="reportCtrl()">
        <div class="m-6 space-y-6">
            <template x-for="(img, idx) in imgSrcs.reportImgs">
                <img 
                    class="border border-black shadow-md rounded-2xl"
                    x-intersect="loadImage('reportImgs', idx)"
                    :src="img.show ? img.imgSrc : ''"
                    />
            </template>
        </div>
        <div class="mx-6 border border-black shadow-md rounded-2xl bg-white" x-show="imgSrcs.staticImgs.length > 0">
            <h1 class="p-3 text-5xl font-bold">Additional Information</h1>
        </div>
        <div class="m-6 mt-0 space-y-6">
            <template x-for="(img, idx) in imgSrcs.staticImgs">
                <img 
                    class="border border-black shadow-md rounded-2xl"
                    x-intersect="loadImage('staticImgs', idx)"
                    :src="img.show ? img.imgSrc : ''"
                    />
            </template>
        </div>
    </div>

    <!-- Main Script -->
    <script src="dist/main.js" type="text/javascript"></script>
</body>

</html>