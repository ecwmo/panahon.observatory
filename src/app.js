import "./styles.css";
import "weather-icons/css/weather-icons.css";
import "weather-icons/css/weather-icons-wind.css";

import Alpine from "alpinejs";

const urlPaths = window.location.pathname.split("/");
const urlPath = urlPaths[urlPaths.length - 1];

switch (urlPath) {
  case "index.php":
    import("./js/ModelPage").then(({ metFields, fcstTimes, modelSelect }) => {
      window.metFields = metFields;
      window.fcstTimes = fcstTimes;
      Alpine.data("metFields", metFields);
      Alpine.data("modelSelect", modelSelect);
      Alpine.start();
    });
    break;
  case "reports.php":
    Promise.all([
      import("@alpinejs/intersect"),
      import("./js/ReportPage"),
    ]).then((libs) => {
      const { default: intersect } = libs[0];
      const { reportCtrl } = libs[1];
      Alpine.plugin(intersect);
      Alpine.data("reportCtrl", reportCtrl);
      Alpine.start();
    });
    break;
  case "new-report.php":
    import("./js/NewReportPage").then(({ newReport }) => {
      Alpine.data("newReport", newReport);
      Alpine.start();
    });
    break;
  case "quickview.php":
    import("./js/QuickViewPage").then(({ stationSelect }) => {
      Alpine.data("stationSelect", stationSelect);
      Alpine.start();
    });
    break;
  case "climate.php":
    import("./js/ClimatePage").then(({ climateSelect }) => {
      (function () {
        var templates = document.querySelectorAll("svg template");
        var el, template, attribs, attrib, count, child, content;
        for (var i = 0; i < templates.length; i++) {
          el = templates[i];
          template = el.ownerDocument.createElement("template");
          el.parentNode.insertBefore(template, el);
          attribs = el.attributes;
          count = attribs.length;
          while (count-- > 0) {
            attrib = attribs[count];
            template.setAttribute(attrib.name, attrib.value);
            el.removeAttribute(attrib.name);
          }
          el.parentNode.removeChild(el);
          content = template.content;
          while ((child = el.firstChild)) {
            content.appendChild(child);
          }
        }
      })();
      Alpine.data("climateSelect", climateSelect);
      Alpine.start();
    });
    break;
  default:
    import("./js/ModelPage").then(({ metFields, fcstTimes, modelSelect }) => {
      window.metFields = metFields;
      window.fcstTimes = fcstTimes;
      Alpine.data("metFields", metFields);
      Alpine.data("modelSelect", modelSelect);
      Alpine.start();
    });
    break;
}
