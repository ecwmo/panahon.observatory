const metFields = [
  { varName: "rain", text: "Rainfall" },
  { varName: "t2", text: "Temperature" },
  { varName: "rh", text: "Relative Humidity" },
  { varName: "winds", text: "Wind Speed" },
];

const fcstTimes = [
  { val: 24, text: "24hr" },
  { val: 48, text: "48hr" },
  { val: 72, text: "72hr" },
];

function modelSelect() {
  return {
    varName: "rain",
    fcstTime: 24,
    setVarName(val) {
      this.varName = val;
    },
    setFcstTime(val) {
      this.fcstTime = val;
    },
  };
}

export { metFields, fcstTimes, modelSelect };
