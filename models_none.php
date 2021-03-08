<?php include_once('./components/header.php'); ?>
    <div class="contents row py-4 mx-0">
      <div id="sidebar" class="col-md-12 col-lg-3">
        <div class="btn-group-toggle" data-toggle="buttons">
          <h3 class="text-center mt-4 mb-2">Fields</h3>
          <label class="btn btn-secondary btn-block active">
            <input type="radio" name="fields" id="rain" value="rain" autocomplete="off" checked> Rainfall
          </label>
         <!-- <label class="btn btn-secondary btn-block">
            <input type="radio" name="fields" id="rh" value="rh" autocomplete="off"> Relative Humidity
          </label>
          <label class="btn btn-secondary btn-block">
            <input type="radio" name="fields" id="winds" value="winds" autocomplete="off"> Wind Speed
          </label>
	-->
        </div>
      </div>
      <div class="col-md-12 col-lg-9">
        <h2 class="text-center mt-4">Weather Maps</h2>
        <h5 class="text-center mt-3">Forecast Length</h5>
        <div class="text-center">
          <div class="btn-group btn-group-toggle btn-group-sm" data-toggle="buttons">
            <label class="btn btn-secondary active">
              <input type="radio" name="forecast-length" id="12hr" value="12hr" autocomplete="off" checked> 12 hr
            </label>
            <label class="btn btn-secondary">
              <input type="radio" name="forecast-length" id="24hr" value="24hr" autocomplete="off"> 24 hr
            </label>
            <label class="btn btn-secondary">
              <input type="radio" name="forecast-length" id="48hr" value="48hr" autocomplete="off"> 48 hr
            </label>
            <label class="btn btn-secondary">
              <input type="radio" name="forecast-length" id="72hr" value="72hr" autocomplete="off"> 72 hr
            </label>
          </div>
        </div>
        <div id="weather-img" class="center-cropped"></div>
      </div>
    </div>
  </div>

  <!-- Optional JavaScript -->
  <!-- jQuery first, then Popper.js, then Bootstrap JS -->
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
    crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
    crossorigin="anonymous"></script>

  <script src="./wwi-scripts/climate.js" type="text/javascript"></script>
  <script src="./wwi-scripts/models.js" type="text/javascript"></script>
</body>

</html>
