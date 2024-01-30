import type { APIRoute } from 'astro'
import { addHours, format } from 'date-fns'

import { resourceDir, resourcePath } from '@/pages/_common'
import { getLatestDate } from '@/pages/api/_common'
import { readFile, readdir } from 'fs/promises'

export const GET: APIRoute = async ({ request }) => {
  try {
    const { searchParams } = new URL(request.url)

    const dt = await getLatestDate()

    const dtStr1 = format(dt, 'yyyy-MM-dd_HH')
    const dtStr2 = format(addHours(dt, dt.getTimezoneOffset() / 60), 'yyyyMMdd/HH')

    let res: string[] | Record<string, string[]> = []
    if (searchParams.has('img')) {
      const imgType = searchParams.get('img')

      if (imgType === '2') {
        const imgDir = 'model/web_img'
        const cmapImgDir = `${imgDir}/cmap`

        res = await readdir(`${resourceDir}/${imgDir}`)
          .then((imgs) =>
            imgs
              .filter((f) => f.includes(dtStr1) && f.endsWith('.png'))
              .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
              .map((f) => `${resourcePath}/${imgDir}/${f}`)
          )
          .catch(() => [])

        const cmaps = await readdir(`${resourceDir}/${cmapImgDir}`)
          .then((imgs) => imgs.filter((f) => f.endsWith('.png')).map((f) => `${resourcePath}/${cmapImgDir}/${f}`))
          .catch(() => [])

        res = {
          imgs: res,
          cmaps,
        }
      } else {
        const imgFreq = imgType ?? '24hrly'
        const imgDir = 'model/img'
        const imgDir2 = `${imgDir}/${imgFreq}/${dtStr2}`

        res = await readdir(`${resourceDir}/${imgDir2}`)
          .then((imgs) =>
            imgs
              .filter((f) => f.endsWith('.png'))
              .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
              .map((f) => `${resourcePath}/${imgDir2}/${f}`)
          )
          .catch(() => [])

        const res2 = await readdir(`${resourceDir}/${imgDir}`)
          .then((imgs) => {
            const img = imgs.find((f) => f === `wrf-ts_${dtStr1}PHT.png`)
            if (img) {
              return `${resourcePath}/${imgDir}/${img}`
            }
            return ''
          })
          .catch(() => '')

        res = [...res, res2]
      }
    } else {
      res = await readFile(`${resourceDir}/model/forecast_${dtStr1}PHT.json`, 'utf8')
        .then((d) => JSON.parse(d))
        .catch(() => ({}))
    }
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    return new Response(`Something went wrong in api/forecast route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    })
  }
}
