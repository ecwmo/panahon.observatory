import type { APIRoute } from 'astro'

import { resourcePath } from '@/lib/helper/pages'
import { getLatestDate } from '@/lib/helper/api'
import { addHours, format } from 'date-fns'

export const GET: APIRoute = async () => {
  try {
    const dt = await getLatestDate()
    const hrArr = [24, 48, 72, 96, 120]
    const filePrfxs = ['rain', 'rainx', 'wind', 'hix']

    const dtStr1 = format(dt, 'yyyy-MM-dd_HH')
    const dtStr2 = format(addHours(dt, dt.getTimezoneOffset() / 60), 'yyyyMMdd/HH')

    const fcst = filePrfxs.reduce((o, e) => {
      o[e] = hrArr.map((h) => `${resourcePath}/model/img/24hrly/${dtStr2}/wrf-${h}hr_${e}_${dtStr1}PHT.png`)
      return o
    }, {} as Record<string, string[]>)

    fcst['ari'] = hrArr.map((h) => `${resourcePath}/model/img/wrf-${h}hr_ari_${dtStr1}PHT.png`)

    const dayArr = [1, 3, 5]
    const fileFrag = {
      rain: 'totalprecip',
      rainx: 'totalprecip_extreme',
    } as Record<string, string>

    const fcstAccum = Object.keys(fileFrag).reduce((o, e) => {
      o[e] = dayArr.map((d) => `${resourcePath}/model/img/ewb/wrf-${d}day_${fileFrag[e]}_${dtStr1}PHT.png`)
      return o
    }, {} as Record<string, string[]>)

    const dt2 = await getLatestDate('ewb')
    const dayArray2 = [1, 3, 5, 7, 30]
    const filePrfxs2 = ['gsmap', 'station']

    const dt2Str1 = format(dt2, 'yyyy-MM-dd_HH')

    const obs = filePrfxs2.reduce((o, e) => {
      o[e] = dayArray2.map((d) => `${resourcePath}/model/img/ewb/${e}_${d}day_totalprecip_${dt2Str1}PHT.png`)
      return o
    }, {} as Record<string, string[]>)

    obs['gsmapx'] = dayArray2.map(
      (d) => `${resourcePath}/model/img/ewb/gsmap_${d}day_totalprecip_extreme_${dt2Str1}PHT.png`
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
