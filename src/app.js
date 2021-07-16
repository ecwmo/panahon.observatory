import "./styles.css";

import Alpine from "alpinejs";

import { stationSelect } from "./js/QuickViewPage";
import { metFields, fcstTimes, modelSelect } from "./js/ModelPage";
import { reportCtrl } from "./js/ReportPage";
import { newReport } from "./js/NewReportPage";

window.metFields = metFields;
window.fcstTimes = fcstTimes;

Alpine.data("stationSelect", stationSelect);
Alpine.data("metFields", metFields);
Alpine.data("modelSelect", modelSelect);
Alpine.data("reportCtrl", reportCtrl);
Alpine.data("newReport", newReport);

Alpine.start();
