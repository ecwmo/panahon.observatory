export const windDirDeg2Str = (val: number) => {
  if (!(val >= 0 && val <= 360)) return ''
  if (val <= 22.5) return 'N'
  else if (val <= 45) return 'NNE'
  else if (val <= 67.5) return 'NE'
  else if (val <= 90) return 'ENE'
  else if (val <= 112.5) return 'E'
  else if (val <= 135) return 'ESE'
  else if (val <= 157.5) return 'SE'
  else if (val <= 180) return 'SSE'
  else if (val <= 202.5) return 'S'
  else if (val <= 225) return 'SSW'
  else if (val <= 247.5) return 'SW'
  else if (val <= 270) return 'WSW'
  else if (val <= 292.5) return 'W'
  else if (val <= 315) return 'WNW'
  else if (val <= 337.5) return 'NW'
  else return 'NNW'
}

export const windDirDeg: Record<string, number> = {
  N: 180,
  NNE: 202.5,
  NE: 225,
  ENE: 247.5,
  E: 270,
  ESE: 292.5,
  SE: 315,
  SSE: 337.5,
  S: 0,
  SSW: 22.5,
  SW: 45,
  WSW: 67.5,
  W: 90,
  WNW: 112.5,
  NW: 135,
  NNW: 157.5,
}

export const heatIndex = (t: number, rh: number) => {
  // source: https://github.com/mcci-catena/heat-index/blob/master/heat-index.js
  const tf = (t * 9.0) / 5.0 + 32.0
  const tfRounded = Math.floor(tf + 0.5)

  // return null outside the specified range of input parameters
  if (tfRounded < 76 || tfRounded > 126) return null
  if (rh < 0 || rh > 100) return null

  // according to the NWS, we try this first, and use it if we can
  let hiEasyF = 0.5 * (tf + 61.0 + (tf - 68.0) * 1.2 + rh * 0.094)

  // The NWS says we use tHeatEasy if (tHeatHeasy + t)/2 < 80.0
  // This is the same computation:
  if (hiEasyF + tf < 160.0) {
    const hiEasy = ((hiEasyF - 32.0) * 5.0) / 9.0
    return Math.round(hiEasy * 10) / 10
  }

  // need to use the hard form, and possibly adjust.
  const tf2 = tf * tf
  const rh2 = rh * rh
  let hiF =
    -42.379 +
    2.04901523 * tf +
    10.14333127 * rh -
    0.22475541 * tf * rh -
    0.00683783 * tf2 -
    0.05481717 * rh2 +
    0.00122874 * tf2 * rh +
    0.00085282 * tf * rh2 -
    0.00000199 * tf2 * rh2

  // these adjustments come from the NWA page, and are needed to
  // match the reference table.
  let tAdjF: number
  if (rh < 13.0 && 80.0 <= tf && tf <= 112.0)
    tAdjF = -((13.0 - rh) / 4.0) * Math.sqrt((17.0 - Math.abs(tf - 95.0)) / 17.0)
  else if (rh > 85.0 && 80.0 <= tf && tf <= 87.0) tAdjF = ((rh - 85.0) / 10.0) * ((87.0 - tf) / 5.0)
  else tAdjF = 0

  // apply the adjustment
  hiF += tAdjF

  // finally, the reference tables have no data above 183 (rounded),
  // so filter out answers that we have no way to vouch for.
  if (hiF >= 183.5) return null
  else {
    const hiC = ((hiF - 32.0) * 5.0) / 9.0
    return Math.round(hiC * 10) / 10
  }
}
