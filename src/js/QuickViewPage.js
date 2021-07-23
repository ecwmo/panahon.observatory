import { format as formatDate } from "date-fns";

const PH_MAP = "./resources/static/map/ph400.png";
const MM_MAP = "./resources/static/map/mm400.png";

const defaultStationObs = {
  rr: 0.0,
  temp: 0.0,
  hi: 0.0,
  wspd: 0.0,
  wdir: 0.0,
  pres: 0,
  tx: 0.0,
  tn: 0.0,
  rain24h: 0,
  checked: false,
};

const defaultStationId = "989003";

const dropInactiveStations = (stnLyr, validIds) => {
  Object.keys(stnLyr).forEach((id) => {
    if (validIds.indexOf(id) === -1) delete stnLyr[id];
  });
};

const loc2px = (stnLyr, map = "mm") => {
  const maxTop = 470;
  const maxLeft = 400;

  let latRange = [14.25, 14.9];
  let lonRange = [120.85, 121.4];
  if (map == "ph") {
    latRange = [3.9, 21.85];
    lonRange = [114.5, 129.8];
  }

  const dLat = latRange[1] - latRange[0];
  const dLon = lonRange[1] - lonRange[0];

  Object.keys(stnLyr).forEach((id) => {
    const { lat, lon } = stnLyr[id];
    const top = +((maxTop * (latRange[1] - lat)) / dLat).toFixed();
    const left = +((maxLeft * (lon - lonRange[0])) / dLon).toFixed();

    stnLyr[id] = { ...stnLyr[id], top, left };
  });
};

const windDirDeg2Str = (val) => {
  if (val === null || val < 0) return "";
  if (val <= 22.5) return "N";
  else if (val <= 45) return "NNE";
  else if (val <= 67.5) return "NE";
  else if (val <= 90) return "ENE";
  else if (val <= 112.5) return "E";
  else if (val <= 135) return "ESE";
  else if (val <= 157.5) return "SE";
  else if (val <= 180) return "SSE";
  else if (val <= 202.5) return "S";
  else if (val <= 225) return "SSW";
  else if (val <= 247.5) return "SW";
  else if (val <= 270) return "WSW";
  else if (val <= 292.5) return "W";
  else if (val <= 315) return "WNW";
  else if (val <= 337.5) return "NW";
  else return "NNW";
};

const formatStnObsValues = (stnObs, stnId) => {
  if (!stnObs[stnId]["checked"]) {
    Object.keys(stnObs[stnId]).forEach((k) => {
      if (["rr", "rain24h"].indexOf(k) !== -1) {
        stnObs[stnId][k] = stnObs[stnId][k] ? +stnObs[stnId][k].toFixed() : 0;
      } else {
        stnObs[stnId][k] = stnObs[stnId][k] ? +stnObs[stnId][k].toFixed(1) : 0;
      }
      if (k === "wdir") {
        stnObs[stnId]["wdirStr"] = windDirDeg2Str(stnObs[stnId][k]);
      }
    });

    stnObs[stnId] = { ...stnObs[stnId], checked: true };
  }
  return stnObs[stnId];
};

const getSafeStationId = (stnLyr, stnId = null) => {
  const stdIds = Object.keys(stnLyr);
  if (stnId === null || stdIds.indexOf(stnId) === -1) {
    if (stdIds.indexOf(defaultStationId) === -1) {
      return stnLyr[stdIds[0]];
    } else {
      return defaultStationId;
    }
  }
  return stnId;
};

function stationSelect() {
  return {
    mapSrc: MM_MAP,
    mapAlt: "Topographical Map of the Philippines",
    activeLayer: null,
    stationIds: [],
    stationLayers: [],
    stationObs: [],
    activeVarPanel: "rain",
    activeStation: { name: "" },
    activeStationId: null,
    activeStationObs: defaultStationObs,
    timeStamp: new Date(),
    timeStr: "",
    dateTimeStr: "",
    showMoreInfo: false,
    init() {
      Promise.all([
        fetch("/resources/station/stn_map_mm.json").then((res) => res.json()),
        fetch("/resources/station/stn_mo_obs.json").then((res) => res.json()),
        fetch("/resources/station/stn_obs.json").then((res) => res.json()),
      ]).then((d) => {
        this.stationLayers = [[], d[0]];
        this.stationObs = { ...d[1], ...d[2] };

        this.stationIds = Object.keys(this.stationObs);

        dropInactiveStations(this.stationLayers[1], this.stationIds);
        loc2px(this.stationLayers[1]);

        this.activeLayer = this.stationLayers[1];
        this.activeStationId = getSafeStationId(this.activeLayer);
        this.activeStation = this.activeLayer[this.activeStationId];

        this.activeStationObs = formatStnObsValues(
          this.stationObs,
          this.activeStationId
        );

        fetch("/resources/station/stn_map_ph.json")
          .then((res) => res.json())
          .then((d) => {
            this.stationLayers[0] = d;
            dropInactiveStations(this.stationLayers[0], this.stationIds);
            loc2px(this.stationLayers[0], "ph");
          });
      });

      fetch("/resources/station/stn_obs_timestamp.json")
        .then((res) => res.json())
        .then((d) => {
          this.timeStamp = new Date(d.timestamp);
          this.timeStr = formatDate(this.timeStamp, "h bbb");
          this.dateTimeStr = formatDate(
            this.timeStamp,
            "MMMM d, yyyy h:00 bbb"
          );
        });
    },
    changeMap(name) {
      if (name === "mm") {
        this.mapSrc = MM_MAP;
        this.mapAlt = "Topographical Map of Metro Manila and Neighborhood";
        this.activeLayer = this.stationLayers[1];
        this.activeStationId = getSafeStationId(
          this.activeLayer,
          this.activeStationId
        );
      } else {
        this.mapSrc = PH_MAP;
        this.mapAlt = "Topographical Map of the Philippines";
        this.activeLayer = this.stationLayers[0];
      }
    },
    handleStationChange() {
      if (this.activeStation.name !== "") {
        this.activeStation = this.activeLayer[this.activeStationId];
        this.activeStationObs = formatStnObsValues(
          this.stationObs,
          this.activeStationId
        );
      }
    },
    setActiveVarPanel(varName) {
      this.activeVarPanel = varName;
    },
  };
}

export { stationSelect };
