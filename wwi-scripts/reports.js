$(document).ready(function () {
  var viewType = $.urlParam('view');
  var imgSrc = "public"
  var simgSrc = "static"

  if (viewType === "draft") {
    imgSrc = "draft"
    simgSrc = "sdraft"
  }

  var remoteSrc = 'http://panahon.observatory.ph/api/fetch-report.php';

  $.ajax({
    url: remoteSrc,
    cache: false,
    dataType: 'json',
    data: `src=${imgSrc}`,
    success: function (data) {
      $("#report-img").empty();
      $.each(data, function(index) {
        $.loadImg(`http://panahon.observatory.ph/api/resources/reports/${imgSrc}`, $("#report-img"), data[index]);
      });
    }
  });

  $.ajax({
    url: remoteSrc,
    cache: false,
    dataType: 'json',
    data: `src=${simgSrc}`,
    success: function (data) {
      $("#report-static-img").empty();
      $.each(data, function(index) {
        $.loadImg(`http://panahon.observatory.ph/api/resources/reports/${simgSrc}`, $("#report-static-img"), data[index]);
      });
    }
  });
});

$.loadImg = function (src, parent, img) {
  var img_src = `${src}/${img}`;

  var img = $("<img />", {
    "class": "img-fluid",
    "src": img_src
  });

  var img_container = $("<div />", { "class": "border border-dark my-2" });
  img_container.append(img);
  parent.append(img_container);
}

$.urlParam = function (name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null) {
    return null;
  }
  else {
    return decodeURI(results[1]) || 0;
  }
}
