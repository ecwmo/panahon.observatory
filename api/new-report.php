<?php include("./components/header.php"); ?>
<?php include("./components/nav.php"); ?>

<?php
  if(!isset($_SESSION['valid'])){ //if login in session is not set
    header("Location: http://panahon.observatory.ph/api/login.php");
}
?>
  
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

    <script src="./scripts/main.js" type="text/javascript"></script>
  <script src="./scripts/new-report.js" type="text/javascript"></script>
</body>

</html>
