import type { APIRoute } from 'astro'

import { getLatestDate, resourceDir, resourcePath } from '@/pages/api/_common'
import { readdir, readFile } from 'fs/promises'

import { formatInTimeZone } from 'date-fns-tz'

export const get: APIRoute = async ({ request }) => {
  try {
    const { searchParams } = new URL(request.url)

    const dt = await getLatestDate()

    const fileTimestamp = formatInTimeZone(dt, 'Asia/Manila', 'yyyy-MM-dd_HH')

    let res: string[] | Record<string, string[]> = []
    if (searchParams.has('img')) {
      const imgType = searchParams.get('img')

      if (imgType === '2') {
        const imgDir = 'model/web_img'
        const cmapImgDir = `${imgDir}/cmap`

        res = await readdir(`${resourceDir}/${imgDir}`)
          .then((imgs) =>
            imgs
              .filter((f) => f.includes(fileTimestamp) && f.endsWith('.png'))
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
        const imgDir2 = `${imgDir}/${imgFreq}/${formatInTimeZone(dt, 'UTC', 'yyyyMMdd/HH')}`

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
            const img = imgs.find((f) => f === `wrf-ts_${formatInTimeZone(dt, 'Asia/Manila', 'yyyy-MM-dd_HH')}PHT.png`)
            if (img) {
              return `${resourcePath}/${imgDir}/${img}`
            }
            return ''
          })
          .catch(() => '')

        res = [...res, res2]
      }
    } else {
      res = await readFile(`${resourceDir}/model/forecast_${fileTimestamp}PHT.json`, 'utf8')
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
