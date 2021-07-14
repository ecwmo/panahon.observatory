<!doctype html>
<html lang="en">
<?php include_once('./components/head.php'); ?>

<?php
    if ($_GET['view']=="draft") {
        $imgSrc = "draft";
        $simgSrc = "sdraft";
    } else {
        $imgSrc = "public";
        $simgSrc = "static";
    }
    if (array_key_exists('new', $_GET)) {
        header("Location: /new-report.php");
    }
?>

<body class="bg-gray-600 w-full md:w-4/5 mx-auto">
    <?php include_once('./components/header.php'); ?>
    <div class="bg-gray-300 border-l border-r border-b border-black flex flex-col">
        <div class="m-6 space-y-6">
            <?php
                $imgs = glob('./resources/reports/img/'. $imgSrc  .'/*.png');
                foreach ($imgs as $img) { 
            ?>
                <img class="border border-black shadow-md rounded-2xl" src="<?php echo $img; ?>" />
            <?php } ?>
        </div>
        <?php 
            $imgs = glob('./resources/reports/img/'. $simgSrc  .'/*.png');
            if(count($imgs) > 0) { 
        ?>
        <div class="mx-6 border border-black shadow-md rounded-2xl bg-white">
            <h1 class="p-3 text-5xl font-bold">Additional Information</h1>
        </div>
        <div class="m-6 space-y-6">
            <?php foreach ($imgs as $img) { ?>
                <img class="border border-black shadow-md rounded-2xl" src="<?php echo $img; ?>" />
            <?php } ?>
        </div>
        <?php } ?>
    </div>

    <!-- Main Script -->
    <script src="dist/main.js" type="text/javascript"></script>
</body>

</html>