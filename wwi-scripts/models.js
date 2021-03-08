$(document).ready(function () {
  var field = 'rain';
  var forecast_length = '12hr';

  load_img();

  $('input[name="fields"]').change(function () {
    field = $('input[name="fields"]:checked').val();
    load_img();
  });

  $('input[name="forecast-length"]').change(function () {
    forecast_length = $('input[name="forecast-length"]:checked').val();
    load_img();
  });

  function load_img() {
    var img_src = `./wwi-images/model/gfs-${forecast_length}_${field}_latest.gif`;
    var img = $("<img />").attr('src', img_src)
      .on('load', function () {
        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
          alert('broken image!');
        } else {
          $("#weather-img").empty().append(img);
        }
      });
  }
});
