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
  multTime?: boolean
  multLoc?: boolean
  headerName?: string
}
export const metFields: MetField[] = [
  {
    val: 'rain',
    text: 'Rainfall',
    extVal: {
      24: 'rainx', // 'rainx' or 'ari'
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
    multTime: false,
    multLoc: true,
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

export const locationNames = [
  'NCR',
  'Baguio',
  'Balesin',
  'Batangas',
  'Bongao',
  'CDO',
  'Calapan',
  'Cebu',
  'Clark',
  'Davao',
  'GeneralSantos',
  'Iloilo',
  'Koronadal',
  'Legazpi',
  'PuertoPrincesa',
  'SanFernando',
  'Surigao',
  'Tacloban',
  'Tarlac',
  'Tuguegarao',
  'Vigan',
  'Zamboanga',
]
