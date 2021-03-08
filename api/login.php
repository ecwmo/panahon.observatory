<?php include("./components/header.php"); ?>
<?php include("./components/nav.php"); ?>
  <div class="contents">
    <div class="row justify-content-center py-4">
      <div class="col-6 p-3 border border-info">
        <div class="jumbutron">
          <h1 class="display-5">Login</h1>
        </div>
        <?php if ($_SESSION["valid"]) { ?>
        <h3>You are already logged in as <?php echo $_SESSION["username"]; ?></h3>
        <?php } else { ?>
        <form enctype="application/pdf" id="loginForm">
          <div class="form-group">
            <label for="usernameInput">Username</label>
            <input type="text" class="form-control" id="usernameInput" placeholder="mobservatory" required>
            <div class="invalid-feedback">
              Please provide a valid username.
            </div>
          </div>
          <div class="form-group">
            <label for="passwordInput">Password</label>
            <input type="password" class="form-control" id="passwordInput" required>
            <div class="invalid-feedback">
              Please provide a password.
            </div>
          </div>
          <button type="submit" class="btn btn-primary" id="loginBtn">Login</button>
        </form>
        <?php } ?>
      </div>
    </div>

    <div class="row justify-content-center pt-0 pb-2 d-none" id="messageDiv">
      <div class="col-6 border border-dark p-0">
        <div class="alert alert-error m-0">
          <h4 class="alert-heading">Login error</h4>
          <p></p>
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
  <script src="./scripts/login.js" type="text/javascript"></script>
</body>

</html>
