import type { APIRoute } from 'astro'

import { format, parse } from 'date-fns'

import { resourcePath } from '@/pages/_common'
import { getLatestDate } from '@/pages/api/_common'

export const GET: APIRoute = async ({ params, request }) => {
  const { searchParams } = new URL(request.url)
  const dtStr = searchParams.has('dt')
    ? searchParams.get('dt')
    : format(await getLatestDate(), 'yyyyMMdd X').split(' ')[0]
  const dt = parse(`${dtStr}_08 +08`, 'yyyyMMdd_HH X', new Date())
  const dtStr2 = format(dt, 'yyyy-MM-dd_HH')

  let fName = ''
  if (params.varName) {
    const { varName } = params
    switch (varName) {
      case 'wrf-ts':
        fName = `${resourcePath}/model/img/wrf-ts_${dtStr2}PHT.png`
        break
    }
  }
  return new Response(fName)
}
