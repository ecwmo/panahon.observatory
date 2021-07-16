// import { stationList } from "../data/station";
import stationMapPH from "../../resources/data/station_map_ph.json";
import stationMapMM from "../../resources/data/station_map_mm.json";

const PH_MAP = "./resources/static/map/ph400.png";
const MM_MAP = "./resources/static/map/mm400.png";

function stationSelect() {
  return {
    mapSrc: PH_MAP,
    mapAlt: "Topographical Map of the Philippines",
    stationPts: stationMapPH,
    activeVarPanel: "rain",
    changeMap(name) {
      if (name === "mm") {
        this.mapSrc = MM_MAP;
        this.mapAlt = "Topographical Map of Metro Manila and Neighborhood";
        this.stationPts = stationMapMM;
      } else {
        this.mapSrc = PH_MAP;
        this.mapAlt = "Topographical Map of the Philippines";
        this.stationPts = stationMapPH;
      }
    },
    setActiveVarPanel(varName) {
      this.activeVarPanel = varName;
    },
  };
}

export { stationSelect };
