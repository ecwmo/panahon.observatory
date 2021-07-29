import { format as formatDate } from "date-fns";

import { getColor } from "./color";

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

const varRange = {
  rain: {
    min: 0,
    max: 25,
  },
  temp: {
    min: 25,
    max: 35,
  },
};

const dropInactiveStations = (stnLyr, validIds) => {
  return Object.keys(stnLyr)
    .filter((k) => validIds.includes(k))
    .reduce((o, k) => {
      o[k] = stnLyr[k];
      return o;
    }, {});
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

  return Object.keys(stnLyr).reduce((o, k) => {
    const { lat, lon } = stnLyr[k];
    const top = +((maxTop * (latRange[1] - lat)) / dLat).toFixed();
    const left = +((maxLeft * (lon - lonRange[0])) / dLon).toFixed();
    o[k] = { ...stnLyr[k], top, left };
    return o;
  }, {});
};

const formatStnLayer = (stnLyr, stationObs, map = "mm") => {
  const stationIds = Object.keys(stationObs);
  let ret = dropInactiveStations(stnLyr, stationIds);
  ret = loc2px(ret, map);
  return Object.keys(ret).reduce((o, k) => {
    o[k] = { ...ret[k], obs: stationObs[k] };
    return o;
  }, {});
};

const formatStnObsValues = (stnObs) => {
  if (!stnObs["checked"]) {
    return Object.keys(stnObs).reduce((o, k) => {
      if (["wdirStr"].indexOf(k) === -1) {
        if (["rr", "rain24h"].indexOf(k) !== -1) {
          o[k] = stnObs[k] ? +stnObs[k].toFixed() : 0;
        } else {
          o[k] = stnObs[k] ? +stnObs[k].toFixed(1) : 0;
        }
      }
      if (k === "wdir") {
        o["wdirStr"] = windDirDeg2Str(stnObs[k]);
      }
      o["checked"] = true;
      return o;
    }, {});
  }
  return stnObs;
};

const setPtColor = (stn, varName) => {
  let ret = stn;
  if (Object.keys(varRange).indexOf(varName) !== -1) {
    ret = Object.keys(ret).reduce((o, k) => {
      let colors = {}.hasOwnProperty.call(ret[k], "colors")
        ? ret[k]["colors"]
        : {};
      let _varName = varName === "rain" ? "rain24h" : varName;
      o[k] = ret[k];
      if (!{}.hasOwnProperty.call(colors, varName)) {
        let val = o[k]["obs"][_varName];
        const _val =
          (val - varRange[varName].min) /
          (varRange[varName].max - varRange[varName].min);
        colors = { ...colors, [varName]: getColor(_val, varName) };
        o[k]["colors"] = colors;
      }
      return o;
    }, {});
  }
  return ret;
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
    stationLayers: [],
    activeVariable: "rain",
    activeStationId: null,
    timeStamp: new Date(),
    showMoreInfo: false,
    init() {
      Promise.all([
        fetch("/resources/station/stn_map_mm.json").then((res) => res.json()),
        fetch("/resources/station/stn_mo_obs.json").then((res) => res.json()),
        fetch("/resources/station/stn_obs.json").then((res) => res.json()),
      ]).then((d) => {
        this.stationLayers = [[], d[0]];
        const stationObs = { ...d[1], ...d[2] };

        this.stationLayers[1] = formatStnLayer(
          this.stationLayers[1],
          stationObs
        );

        this.activeLayer = setPtColor(
          this.stationLayers[1],
          this.activeVariable
        );

        fetch("/resources/station/stn_map_ph.json")
          .then((res) => res.json())
          .then((d) => {
            this.stationLayers[0] = formatStnLayer(d, stationObs, "ph");
          });
      });

      fetch("/resources/station/stn_obs_timestamp.json")
        .then((res) => res.json())
        .then((d) => {
          this.timeStamp = new Date(d.timestamp);
        });
    },
    get activeStation() {
      if (!this.activeStationId) {
        if (!this.activeLayer) return { name: "", obs: defaultStationObs };
        this.activeStationId = getSafeStationId(this.activeLayer);
      }
      const activeStn = this.activeLayer[this.activeStationId];
      activeStn.obs = formatStnObsValues(activeStn.obs);
      return activeStn;
    },
    get timeStr() {
      return formatDate(this.timeStamp, "h bbb");
    },
    get dateTimeStr() {
      return formatDate(this.timeStamp, "MMMM d, yyyy h:00 bbb");
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
      this.activeLayer = setPtColor(this.activeLayer, this.activeVariable);
    },
    setActiveVariable(varName) {
      this.activeVariable = varName;
      this.activeLayer = setPtColor(this.activeLayer, varName);
    },
  };
}

export { stationSelect };
