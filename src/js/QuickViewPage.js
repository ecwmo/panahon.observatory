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
};

function stationSelect() {
  return {
    mapSrc: PH_MAP,
    mapAlt: "Topographical Map of the Philippines",
    activeLayer: null,
    stationLayers: [],
    stationObs: [],
    activeVarPanel: "rain",
    activeStation: { name: "" },
    activeStationObs: defaultStationObs,
    timeStamp: new Date(),
    timeStr: null,
    init() {
      Promise.all([
        fetch("/resources/station/stn_map_ph.json").then((res) => res.json()),
        fetch("/resources/station/stn_map_mm.json").then((res) => res.json()),
        fetch("/resources/station/stn_obs.json").then((res) => res.json()),
        fetch("/resources/station/stn_obs_timestamp.json").then((res) =>
          res.json()
        ),
      ]).then((d) => {
        this.stationLayers = d.slice(0, 2);
        this.stationObs = d[2];
        this.timeStamp = new Date(d[3].timestamp);

        const stationIds = Object.keys(this.stationObs);

        this.stationLayers = this.stationLayers.map((stLyr) => {
          const _stIds = Object.keys(stLyr);
          _stIds.forEach((k) => {
            if (stationIds.indexOf(k) === -1) {
              delete stLyr[k];
            }
          });
          return stLyr;
        });

        this.activeLayer = this.stationLayers[0];
        this.activeStation = this.stationLayers[0][989003];

        this.activeStationObs = this.formatValues(989003);

        this.timeStr = formatDate(this.timeStamp, "h bbb");
      });
    },
    formatValues(id) {
      if (!this.stationObs[id]["checked"]) {
        Object.keys(this.stationObs[id]).forEach((key) => {
          this.stationObs[id][key] = this.stationObs[id][key]
            ? +this.stationObs[id][key].toFixed(2)
            : 0;
        });
      }
      return { ...this.stationObs[id], checked: true };
    },
    changeMap(name) {
      if (name === "mm") {
        this.mapSrc = MM_MAP;
        this.mapAlt = "Topographical Map of Metro Manila and Neighborhood";
        this.activeLayer = this.stationLayers[1];
      } else {
        this.mapSrc = PH_MAP;
        this.mapAlt = "Topographical Map of the Philippines";
        this.activeLayer = this.stationLayers[0];
      }
    },
    setActiveStation(id) {
      this.activeStation = this.activeLayer[id];
      this.activeStationObs = this.formatValues(id);
    },
    setActiveVarPanel(varName) {
      this.activeVarPanel = varName;
    },
  };
}

export { stationSelect };
