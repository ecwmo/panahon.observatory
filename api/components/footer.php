<!doctype html>
<html lang="en">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <meta name="description" content="Experimental model forecasts for the Philippine" />

  <!-- Bootstrap CSS -->
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
    crossorigin="anonymous">

  <link href="./styles/main.css" rel="stylesheet" type="text/css" />

  <title>Tropical Cyclone - Weather Watch Initiative (Manila Observatory)</title>
</head>

<body>
<div class="container">
  <header class="p-2">
    <div class="row">
      <div class="col-8">
        <img alt="Manila Observatory Logo" class="float-left" src="logo.png" />
        <div class="float-left">
          <p class="font-weight-bold">Manila Observatory</p>
          <p>Ateneo de Manila University Campus</p>
          <p>Loyola Heights, Quezon City, Philippines</p>
        </div>
        <div class="float-left head-contact">
          <p>Tel: (632) 426-5921 / 426-0837 / 426-6495</p>
          <p>Fax: (632) 426-0847 / 426-6141</p>
          <p>Email: <a href="#" title="Manila Observatory email address">manila@observatory.ph</a></p>
        </div>
      </div>
    </div>
  </header>
  <!-- <nav class="navbar navbar-light navbar-expand-lg navbar-custom p-0">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav"><li class="nav-item"><a class="nav-link" href="./index.php" title="Latest Summaries - Weather Conditions and Maps">Quick View</a></li><li class="nav-item"><a class="nav-link" href="./stations.php" title="Observation Stations - Graphs and Information">Stations</a></li><li class="nav-item"><a class="nav-link" href="./models.php" title="Model Results - Forecasts and Maps">Models</a></li><li class="nav-item"><a class="nav-link" href="./satellites.php" title="Remote Sensing - Satellite Images">Satellites</a></li><li class="nav-item"><a class="nav-link" href="./climate.php" title="Philippine Climate Information">Climate</a></li><li class="nav-item active"><a class="nav-link" href="./reports.php" title="Tropical Cyclone Report">Reports</a></li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item"><a class="nav-link" href="faq.html" title="Frequently Asked Questions">FAQ</a></li>
      </ul>
    </div>
  </nav> -->
  <div class="contents">
    <div class="row justify-content-center py-4">
      <div class="col-6 p-3 border border-info">
        <div class="jumbutron">
          <h1 class="display-5">Report upload</h1>
        </div>
        <form enctype="application/pdf" id="uploadDocForm">
          <div class="form-group">
            <label for="tcCodeInput">TC Code</label>
            <input type="text" class="form-control" id="tcCodeInput" name="tccode" placeholder="example: wp012020" required>
            <div class="invalid-feedback">
              Please provide a valid TC Code.
            </div>
          </div>
          <div class="form-group">
            <label for="reportNumInput">Report Number</label>
            <input type="number" class="form-control" id="reportNumInput" name="reportnum" placeholder="example: 5" required>
            <div class="invalid-feedback">
              This is a required field.
            </div>
          </div>
          <div class="form-group">
            <label for="docInput">Document</label>
            <input type="file" class="form-control-file" id="docInput" required>
            <div class="invalid-feedback">
              Please provide a valid PDF document.
            </div>
          </div>
          <button type="submit" class="btn btn-primary" id="uploadBtn">Upload</button>
        </form>
      </div>
    </div>
    
    <div class="row justify-content-center pt-0 pb-2 d-none" id="messageDiv">
      <div class="col-6 border border-dark p-0">
        <div class="alert alert-info m-0">
          <h4 class="alert-heading">Upload success!</h4>
          <p>Preview the document <a href="http://panahon.observatory.ph/reports.php?view=draft" target="_blank" class="alert-link">here</a></p>
        </div>
      </div>
    </div>

    <div class="row justify-content-center pt-2 pb-4 d-none" id="publishDiv">
      <div class="col-6 border border-info p-3">
        <button type="button" class="btn btn-primary" id="publishBtn">Publish</button>
      </div>
    </div>
  </div>
</div>
  
  <!-- Optional JavaScript -->
  <!-- jQuery first, then Popper.js, then Bootstrap JS -->
  <script
    src="https://code.jquery.com/jquery-3.5.1.min.js"
    integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
    crossorigin="anonymous"></script>
  <script
    src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
    integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV"
    crossorigin="anonymous"></script>

  <script src="./scripts/new-report.js" type="text/javascript"></script>
</body>

</html>
