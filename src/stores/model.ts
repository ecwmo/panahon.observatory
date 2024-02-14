export type ImageTimestep = {
  val: number
  text: string
}
export const imageTimesteps: ImageTimestep[] = [
  { val: 24, text: '24hr' },
  { val: 3, text: '3hr' },
]

export type MetField = {
  val: string
  text: string
  extVal?: string | { [key: number]: string }
  mult?: boolean
  headerName?: string
}
export const metFields: MetField[] = [
  {
    val: 'rain',
    text: 'Rainfall',
    extVal: {
      24: 'rainx',
    },
  },
  { val: 'temp', text: 'Temperature' },
  {
    val: 'hix',
    text: 'Max Heat Index',
  },
  { val: 'rh', text: 'Relative Humidity' },
  { val: 'wind', text: 'Winds' },
  {
    val: 'wrf-ts',
    text: 'Hourly Forecasts',
    headerName: 'Hourly Forecasts',
    mult: false,
  },
  {
    val: 'wpd',
    text: 'Wind Power Forecast',
  },
  {
    val: 'ppv',
    text: 'Solar Power Forecast',
  },
]
