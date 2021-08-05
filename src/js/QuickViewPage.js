import { format } from "date-fns";
import mapboxgl, { Map } from "mapbox-gl";

import { getColor, getSwatch } from "./color";

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

const formatStnLayer = (stnLyr, stationObs) => {
  const stationIds = Object.keys(stationObs);
  const ret = dropInactiveStations(stnLyr, stationIds);

  return {
    type: "FeatureCollection",
    features: Object.keys(ret).map((k) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [ret[k].lon, ret[k].lat],
      },
      properties: { id: k, ...ret[k], obs: stationObs[k] },
    })),
  };
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

const setPtColor = (lyr, varName) => {
  const { features } = lyr;
  if (Object.keys(varRange).indexOf(varName) !== -1) {
    const newFeats = features.map((f) => {
      const { properties: props } = f;
      let colors = {}.hasOwnProperty.call(props, "colors")
        ? props["colors"]
        : {};
      let _varName = varName === "rain" ? "rain24h" : varName;
      if (!{}.hasOwnProperty.call(colors, varName)) {
        let val = props["obs"][_varName];
        const _val =
          (val - varRange[varName].min) /
          (varRange[varName].max - varRange[varName].min);
        colors = { ...colors, [varName]: getColor(_val, varName) };
        props["colors"] = colors;
      }
      return { ...f, properties: props };
    });
    return { ...lyr, features: newFeats };
  }
  return lyr;
};

const getSafeStationId = ({ features: feats }, stnId = null) => {
  if (!feats) return;
  const stnIds = feats.map(({ properties: props }) => props.id);
  if (stnId === null || stnIds.indexOf(stnId) === -1) {
    if (stnIds.indexOf(defaultStationId) === -1) {
      return stnIds[0];
    } else {
      return defaultStationId;
    }
  }
  return stnId;
};

mapboxgl.accessToken = process.env.MAPBOX_PUBLIC_TOKEN;

const map = new Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [121.04, 14.56],
  zoom: 9.5,
});

const dotSize = 100;

// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.
const pulsingDot = {
  width: dotSize,
  height: dotSize,
  data: new Uint8Array(dotSize * dotSize * 4),

  // When the layer is added to the map,
  // get the rendering context for the map canvas.
  onAdd: function () {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext("2d");
  },

  // Call once before every frame where the icon will be used.
  render: function () {
    const duration = 1600;
    const t = (performance.now() % duration) / duration;

    const radius = (dotSize / 2) * 0.3;
    const outerRadius = (dotSize / 2) * 0.7 * t + radius;
    const context = this.context;

    // Draw the outer circle.
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
    context.fill();

    // Draw the inner circle.
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 100, 100, 0)";
    context.strokeStyle = "white";
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();

    // Update this image's data with data from the canvas.
    this.data = context.getImageData(0, 0, this.width, this.height).data;

    // Continuously repaint the map, resulting
    // in the smooth animation of the dot.
    map.triggerRepaint();

    // Return `true` to let the map know that the image was updated.
    return true;
  },
};

function stationSelect() {
  return {
    stationLayer: null,
    visibleStations: [],
    activeVariable: "rain",
    activeStationId: null,
    timeStamp: new Date(),
    showMoreInfo: false,
    init() {
      Promise.all([
        fetch("/resources/station/stn_map_ph.json").then((res) => res.json()),
        fetch("/resources/station/stn_mo_obs.json").then((res) => res.json()),
        fetch("/resources/station/stn_obs.json").then((res) => res.json()),
      ]).then((d) => {
        const stationObs = { ...d[1], ...d[2] };
        const [[minLon, minLat], [maxLon, maxLat]] = map.getBounds().toArray();

        this.stationLayer = d[0];

        this.stationLayer = formatStnLayer(this.stationLayer, stationObs);

        this.stationLayer = setPtColor(this.stationLayer, this.activeVariable);

        this.visibleStations = this.stationLayer.features.filter(
          ({ properties: { lat, lon } }) =>
            lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon
        );

        map.once("load", () => {
          map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });
          map.addSource("station", {
            type: "geojson",
            data: this.stationLayer,
          });
          map.addLayer({
            id: "station-pts",
            type: "circle",
            source: "station",
            paint: {
              "circle-radius": 5,
              "circle-stroke-color": "#000000",
              "circle-stroke-width": 1,
              "circle-color": [
                "to-color",
                ["get", this.activeVariable, ["get", "colors"]],
              ],
            },
          });
          map.addSource("dot-point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [
                      this.activeStation.lon,
                      this.activeStation.lat,
                    ], // icon position [lng, lat]
                  },
                },
              ],
            },
          });
          map.addLayer({
            id: "layer-with-pulsing-dot",
            type: "symbol",
            source: "dot-point",
            layout: {
              "icon-image": "pulsing-dot",
            },
          });

          map.on("click", "station-pts", (e) => {
            const { properties: props } = e.features[0];
            this.activeStationId = props.id;
          });

          // Change the cursor to a pointer when the mouse is over the places layer.
          map.on("mouseenter", "station-pts", () => {
            map.getCanvas().style.cursor = "pointer";
          });

          // Change it back to a pointer when it leaves.
          map.on("mouseleave", "station-pts", () => {
            map.getCanvas().style.cursor = "";
          });

          map.on("zoomend", () => {
            setTimeout(() => {
              const visibleStations = map.queryRenderedFeatures({
                layers: ["station-pts"],
              });
              const curIds = this.visibleStations.map((d) => d.properties.id);
              const newIds = visibleStations.map((d) => d.properties.id);

              if (curIds.sort().join(",") !== newIds.sort().join(",")) {
                this.visibleStations = visibleStations;
              }
            }, 500);
          });
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
        if (!this.stationLayer) return { name: "", obs: defaultStationObs };
        this.activeStationId = getSafeStationId(this.stationLayer);
      }
      let activeStn = this.stationLayer.features.find(
        ({ properties: prop }) => prop.id === this.activeStationId
      );
      if (activeStn) {
        activeStn = activeStn.properties;
        activeStn.obs = formatStnObsValues(activeStn.obs);
      }
      return activeStn;
    },
    get timeStr() {
      return format(this.timeStamp, "h bbb");
    },
    get dateTimeStr() {
      return format(this.timeStamp, "MMMM d, yyyy h:00 bbb");
    },
    get swatches() {
      const varName = this.activeVariable || "rain";
      const valRange = varRange[varName];
      if (valRange) return getSwatch(varName, valRange.min, valRange.max);
      else return null;
    },
    get varUnit() {
      if (this.activeVariable === "rain") return "mm";
      else if (this.activeVariable === "temp") return "°C";
      else return "";
    },
    changeMap(name) {
      if (name === "mm") {
        this.activeStationId = getSafeStationId(
          this.stationLayer,
          this.activeStationId
        );
        map.setCenter([121.04, 14.56]);
        map.setZoom(9.5);
      } else {
        map.setCenter([121.80434, 12.5549]);
        map.setZoom(4.5);
      }
    },
    setActiveVariable(varName) {
      this.activeVariable = varName;
      this.stationLayer = setPtColor(this.stationLayer, varName);
      map.getSource("station").setData(this.stationLayer);
      map.setPaintProperty("station-pts", "circle-color", [
        "to-color",
        ["get", varName, ["get", "colors"]],
      ]);
    },
    handleStationIdChange() {
      if (this.activeStationId) {
        const dotPt = map.getSource("dot-point");
        if (dotPt) {
          dotPt.setData({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [this.activeStation.lon, this.activeStation.lat], // icon position [lng, lat]
                },
              },
            ],
          });
        }
      }
    },
  };
}

export { stationSelect };
