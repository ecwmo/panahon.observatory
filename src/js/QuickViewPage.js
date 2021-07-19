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

const formatStnObsValues = (stnObs, stnId) => {
  if (!stnObs[stnId]["checked"]) {
    Object.keys(stnObs[stnId]).forEach((k) => {
      stnObs[stnId][k] = stnObs[stnId][k] ? +stnObs[stnId][k].toFixed(2) : 0;
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
    timeStr: null,
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
          });
      });

      fetch("/resources/station/stn_obs_timestamp.json")
        .then((res) => res.json())
        .then((d) => {
          this.timeStamp = new Date(d.timestamp);
          this.timeStr = formatDate(this.timeStamp, "h bbb");
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
