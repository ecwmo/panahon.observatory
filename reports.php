<!doctype html>
<html lang="en">
<?php include_once('./components/head.php'); ?>

<body class="bg-gray-600 w-4/5 mx-auto">
    <?php include_once('./components/header.php'); ?>
    <div class="bg-gray-300 border-l border-r border-b border-black flex flex-col">
        <div class="m-4">
            <?php
            $imgs = glob('./resources/reports/img/'. $imgSrc  .'/*.png');
            foreach ($imgs as $img) {
                print '<img class="mb-2 border border-black" src="'. $img. '" />';
            }
            ?>
        </div>
        <div class="mx-4 border border-black">
            <h1 class="col-lg-12 p-3 display-6"><strong>Additional Information</strong></h1>
        </div>
        <div class="m-4">
            <?php
            $imgs = glob('./resources/reports/img/'. $simgSrc  .'/*.png');
            foreach ($imgs as $img) {
                print '<img class="mb-2 border border-black" src="'. $img. '" />';
            }
            ?>
        </div>
    </div>

    <!-- Main Script -->
    <script src="dist/main.js" type="text/javascript"></script>
</body>

</html>