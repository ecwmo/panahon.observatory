import type { APIRoute } from 'astro'

import { addHours, format, parse } from 'date-fns'

import { resourcePath } from '@/lib/helper/pages'
import { getLatestDate } from '@/lib/helper/api'

export const GET: APIRoute = async ({ params, request }) => {
  const { searchParams } = new URL(request.url)
  const dtStr = searchParams.has('dt')
    ? searchParams.get('dt')
    : format(await getLatestDate(), 'yyyyMMddHH X').split(' ')[0]
  const dt = parse(`${dtStr} +08`, 'yyyyMMddHH X', new Date())
  const dtStr2 = format(dt, 'yyyy-MM-dd_HH')
  const dtStr3 = format(addHours(dt, dt.getTimezoneOffset() / 60), 'yyyyMMdd/HH')

  let fName = ''
  if (params.hr && params.idx && params.varName) {
    const { hr: imgFreq, varName, idx } = params
    const h = +imgFreq * (+idx + 1)

    switch (varName) {
      case 'ari':
        fName = `${resourcePath}/model/img/wrf-${h}hr_ari_${dtStr2}PHT.png`
        break
      default:
        fName = `${resourcePath}/model/img/${+imgFreq}hrly/${dtStr3}/wrf-${h}hr_${varName}_${dtStr2}PHT.png`
    }
  }
  return new Response(fName)
}
