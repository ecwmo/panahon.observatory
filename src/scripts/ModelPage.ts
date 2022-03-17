const metFields = [
  { varName: 'rain', text: 'Daily Rainfall', hasFcstTime: true },
  { varName: 'temp', text: 'Temperature', hasFcstTime: true },
  {
    varName: 'hi',
    text: 'Heat Index',
    hasFcstTime: true,
    caption: `
    The figure above shows the spatial map of forecast heat stress index (HI).
    The HI calculation is based on
      <a
        href="https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml"
        target="_blank" rel="noopener noreferrer">Rothfusz (1990)</a>.
      <img src="resources/model/static/heat_index_static_table.png" class="model-caption-img" />`,
  },
  { varName: 'rh', text: 'Relative Humidity', hasFcstTime: true },
  { varName: 'wind', text: 'Winds', hasFcstTime: true },
  {
    varName: 'wrf-ts',
    text: 'Hourly Forecasts',
    hasFcstTime: false,
    headerName: 'Hourly Forecasts',
  },
  {
    varName: 'wpd',
    text: 'Wind Power Forecast',
    hasFcstTime: true,
    caption: `
    The Wind Power Potential plot uses 100-m wind speed of the model output to approximate the wind
    speed at 80-m, the typical height of wind turbines.
    `,
  },
  {
    varName: 'ppv',
    text: 'Solar Power Forecast',
    hasFcstTime: true,
    caption: `
    The equations used for calculating Photovoltaic Power Potential were based on
      <a
        href="https://pubs.rsc.org/lv/content/articlelanding/2011/ee/c1ee01495a/unauth#!divAbstract"
        target="_blank" rel="noopener noreferrer">Crook et al. (2011)</a>.`,
  },
]

const fcstTimes = [
  { val: 24, text: '24hr' },
  { val: 48, text: '48hr' },
  { val: 72, text: '72hr' },
  { val: 96, text: '96hr' },
  { val: 120, text: '120hr' },
]

interface ModelType {
  defaultHeaderName: string
  headerName: string
  varName: string
  fcstTime: number
  isFcstTimeVisible: boolean
  caption?: string
  setVarName: Function
  setFcstTime: Function
  getImgName: Function
}

const modelSelect = (): ModelType => ({
  defaultHeaderName: 'Model Forecast Maps',
  headerName: 'Model Forecast Maps',
  varName: 'rain',
  fcstTime: 24,
  isFcstTimeVisible: true,
  caption: undefined,
  setVarName(val: string) {
    this.varName = val
    const { caption, hasFcstTime, headerName } = metFields.find(({ varName }) => varName == this.varName) || {
      caption: undefined,
      hasFcstTime: false,
      headerName: '',
    }
    this.isFcstTimeVisible = hasFcstTime
    this.caption = caption
    this.headerName = headerName || this.defaultHeaderName
  },
  setFcstTime(val: number) {
    this.fcstTime = val
  },
  getImgName() {
    if (!this.isFcstTimeVisible) return `${this.varName}_latest.png`
    return `wrf-${this.fcstTime}hr_${this.varName}_latest.png`
  },
})

export { metFields, fcstTimes, modelSelect }
