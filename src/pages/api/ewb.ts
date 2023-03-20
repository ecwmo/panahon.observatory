import type { APIRoute } from 'astro'

import { getLatestDate, resourcePath } from '@/pages/api/_common'
import { formatInTimeZone } from 'date-fns-tz'

export const get: APIRoute = async () => {
  try {
    const dt = await getLatestDate()

    const hrArr = [24, 48, 72, 96, 120]
    const filePrfxs = ['rain', 'rainx', 'wind', 'hix']

    const fcst = filePrfxs.reduce((o, e) => {
      o[e] = hrArr.map(
        (h) =>
          `${resourcePath}/model/img/24hrly/${formatInTimeZone(
            dt,
            'UTC',
            'yyyyMMdd/HH'
          )}/wrf-${h}hr_${e}_${formatInTimeZone(dt, 'Asia/Manila', 'yyyy-MM-dd_HH')}PHT.png`
      )
      return o
    }, {})

    fcst['ari'] = hrArr.map(
      (h) => `${resourcePath}/model/img/wrf-${h}hr_ari_${formatInTimeZone(dt, 'Asia/Manila', 'yyyy-MM-dd_HH')}PHT.png`
    )

    const dayArr = [1, 3, 5]
    const fileFrag = {
      rain: 'totalprecip',
      rainx: 'totalprecip_extreme',
    }

    const fcstAccum = Object.keys(fileFrag).reduce((o, e) => {
      o[e] = dayArr.map(
        (d) =>
          `${resourcePath}/model/img/ewb/wrf-${d}day_${fileFrag[e]}_${formatInTimeZone(
            dt,
            'Asia/Manila',
            'yyyy-MM-dd_HH'
          )}PHT.png`
      )
      return o
    }, {})

    const dt2 = await getLatestDate('ewb')
    const dayArray2 = [1, 3, 5, 7, 30]
    const filePrfxs2 = ['gsmap', 'station']

    const obs = filePrfxs2.reduce((o, e) => {
      o[e] = dayArray2.map(
        (d) =>
          `${resourcePath}/model/img/ewb/${e}_${d}day_totalprecip_${formatInTimeZone(
            dt2,
            'Asia/Manila',
            'yyyy-MM-dd_HH'
          )}PHT.png`
      )
      return o
    }, {})

    obs['gsmapx'] = dayArray2.map(
      (d) =>
        `${resourcePath}/model/img/ewb/gsmap_${d}day_totalprecip_extreme_${formatInTimeZone(
          dt2,
          'Asia/Manila',
          'yyyy-MM-dd_HH'
        )}PHT.png`
    )

    const res = JSON.stringify({
      jtwc: 'https://www.metoc.navy.mil/jtwc/products/abpwsair.jpg',
      pagasa: 'https://pubfiles.pagasa.dost.gov.ph/climps/tcthreat/TC_Threat_and_S2S_Forecast.png',
      fcst,
      fcstAccum,
      obs,
    })

    return new Response(res, {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    return new Response(`Something went wrong in api/ewb route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    })
  }
}
