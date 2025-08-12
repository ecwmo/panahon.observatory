import type { APIRoute } from 'astro'

import { format, parse } from 'date-fns'

import { resourcePath } from '@/lib/helper/pages'
import { getLatestDate } from '@/lib/helper/api'

export const GET: APIRoute = async ({ params, request }) => {
  const { searchParams } = new URL(request.url)
  const dtStr = searchParams.has('dt')
    ? searchParams.get('dt')
    : format(await getLatestDate(), 'yyyyMMddHH X').split(' ')[0]
  const dt = parse(`${dtStr} +08`, 'yyyyMMddHH X', new Date())
  const dtStr2 = format(dt, 'yyyy-MM-dd_HH')

  let fName = ''
  if (params.varName) {
    const { varName } = params
    switch (varName) {
      case 'wrf-ts':
        fName = `${resourcePath}/model/img/wrf-ts_NCR_${dtStr2}PHT.png`
        break
    }
  }
  return new Response(fName)
}
