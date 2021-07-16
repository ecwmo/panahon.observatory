import "./styles.css";
import "@fortawesome/fontawesome-free/js/all";

import "alpinejs";
import { stationSelect } from "./js/QuickViewPage";
import { metFields, fcstTimes, modelSelect } from "./js/ModelPage";
import { newReport } from "./js/NewReportPage";

window.stationSelect = stationSelect;
window.metFields = metFields;
window.fcstTimes = fcstTimes;
window.modelSelect = modelSelect;
window.newReport = newReport;
