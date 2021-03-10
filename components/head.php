<?php 

include_once('./components/helper.php'); 

$curPage = basename($_SERVER['PHP_SELF']);
$curStyle = './wwi-styles/' . str_replace(".php", ".css", $curPage);
$curScript = './wwi-scripts/' . str_replace(".php", ".js", $curPage);

?>

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <meta name="description" content="Experimental model forecasts for the Philippine" />

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

  <link href="./wwi-styles/main.css" rel="stylesheet" type="text/css" />
  <link href="<?php echo $curStyle; ?>" rel="stylesheet" type="text/css" />

  <title><?php getTitle($curPage, $pages); ?></title>
</head>