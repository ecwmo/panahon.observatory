// import { stationList } from "../data/station";
import * as stationMapPH from "../../resources/data/station_map_ph.json";
import * as stationMapMM from "../../resources/data/station_map_mm.json";

function stationSelect() {
  return {
    mapSrc: "./static/map/ph400.png",
    mapAlt: "Topographical Map of the Philippines",
    stationPts: stationMapPH.data,
    activeVarPanel: "rain",
    changeMap(name) {
      if (name === "mm") {
        this.mapSrc = "./static/map/mm400.png";
        this.mapAlt = "Topographical Map of Metro Manila and Neighborhood";
        this.stationPts = stationMapMM.data;
      } else {
        this.mapSrc = "./static/map/ph400.png";
        this.mapAlt = "Topographical Map of the Philippines";
        this.stationPts = stationMapPH.data;
      }
    },
    setActiveVarPanel(varName) {
      this.activeVarPanel = varName;
    }
  };
}

export { stationSelect };
