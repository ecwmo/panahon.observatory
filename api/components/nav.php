<nav class="navbar navbar-light navbar-expand-lg navbar-custom p-0">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
    aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav ml-auto">
      <?php if($_SESSION["valid"]) { ?>
      <button type="submit" class="btn btn-primary nav-item" id="logoutBtn">Logout</button>
      <?php } ?>
    </ul>
  </div>
</nav>