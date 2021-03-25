const metFields = [
  { varName: "rain", text: "Rainfall", hasFcstTime: true },
  { varName: "t2", text: "Temperature", hasFcstTime: true },
  { varName: "rh", text: "Relative Humidity", hasFcstTime: true },
  { varName: "winds", text: "Wind Speed", hasFcstTime: true },
  {
    varName: "heat_index",
    text: "Heat Index",
    hasFcstTime: false,
    caption:
      'The figure above shows the time series of 72-hour forecast heat stress index (HI) and the corresponding monthly climatological HI from the Manila Observatory weather station. The HI calculation is based on <a href="https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml" target="_blank" rel="noopener noreferrer">Rothfusz (1990)</a>. HI values at temperatures below 26.67 degrees Celsius and relative humidity values below 40 % are masked. The monthly climatological HI values are based on the hourly temperature and relative humidity data from the Manila Observatory weather station from 2010 to 2019.'
  }
];

const fcstTimes = [
  { val: 24, text: "24hr" },
  { val: 48, text: "48hr" },
  { val: 72, text: "72hr" }
];

function modelSelect() {
  return {
    varName: "rain",
    fcstTime: 24,
    isFcstTimeVisible: true,
    caption: null,
    setVarName(val) {
      this.varName = val;
      const { caption, hasFcstTime } = (this.isFcstTimeVisible = metFields.find(
        ({ varName }) => varName == this.varName
      ));
      this.isFcstTimeVisible = hasFcstTime;
      this.caption = caption;
    },
    setFcstTime(val) {
      this.fcstTime = val;
    },
    getImgName() {
      if (this.varName === "heat_index") return `${this.varName}.png`;
      return `wrf-${this.fcstTime}hr_${this.varName}.png`;
    }
  };
}

export { metFields, fcstTimes, modelSelect };
