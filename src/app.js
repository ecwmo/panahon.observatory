import "./styles.css";
import "@fortawesome/fontawesome-free/js/all";

import "alpinejs";
import { stationSelect } from "./js/QuickViewPage";
import { metFields, fcstTimes, modelSelect } from "./js/ModelPage";
import { report } from "./js/ReportPage";
import { newReport } from "./js/NewReportPage";

window.stationSelect = stationSelect;
window.metFields = metFields;
window.fcstTimes = fcstTimes;
window.modelSelect = modelSelect;
window.report = report;
window.newReport = newReport;
