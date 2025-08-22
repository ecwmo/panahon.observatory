import SunCalc from 'suncalc'
import { getDayOfYear } from 'date-fns'

const SOLAR_CONSTANT = 1367 // W/m2, average solar constant

// Compute inverse relative distance Earth-Sun (dimensionless)
const inverseRelativeDistance = (date: Date) => {
  const dayOfYear = getDayOfYear(date)
  return 1 + 0.033 * Math.cos(((2 * Math.PI) / 365) * dayOfYear)
}

// Compute air mass from solar elevation angle (approximate)
const airMass = (alt: number) => {
  const zenith = Math.PI / 2 - alt
  return 1 / (Math.cos(zenith) + 0.15 / Math.pow(93.885 - (zenith * 180) / Math.PI, 1.253))
}

// Clear sky beam irradiance (W/m2) simplified model
export const clearSkyIrradiance = (lat: number, lon: number, date = new Date()) => {
  const sunPos = SunCalc.getPosition(date, lat, lon)

  const { altitude } = sunPos

  if (altitude <= 0) return 0 // Sun below horizon

  // Inverse relative distance Earth-Sun
  const dr = inverseRelativeDistance(date)

  // Air mass
  const m = airMass(altitude)

  // Atmospheric transmittance coefficient (tuned empirically, typical values ~0.7-0.8)
  const tau = 0.75

  // Calculate beam irradiance on horizontal surface (simplified clear sky model)
  const I0 = SOLAR_CONSTANT * dr
  const Ir = I0 * Math.pow(tau, m) * Math.sin(altitude)

  return Ir
}
