import type { APIRoute } from 'astro'

import { parse, subDays } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { existsSync } from 'fs'

import { resourceDir, resourcePath } from '@/pages/_common'

export const GET: APIRoute = async ({ params }) => {
  try {
    let dt = parse(`${params.dt}_08 +08`, 'yyyyMMdd_HH x', new Date())

    const fNameGen = (imgDir: string, fPfx: string, fSfxs: string[], imgSubDirs: string[] = []) => {
      return fSfxs.reduce<string[]>((o, fSfx, i) => {
        const imgSubDir = imgSubDirs[i]
        const imgDir2 = imgSubDir ? `${imgDir}/${imgSubDir}` : imgDir
        const fName = `${imgDir2}/${fPfx}${fSfx}`

        if (existsSync(fName)) return [...o, fName.replace(resourceDir, resourcePath)]
        return [...o, null]
      }, [])
    }

    const dayArr = [5, 4, 3, 2, 1]
    const filePfxs = ['wrf', 'wrf_run1', 'wrf_run2', 'wrf_run3']
    const fileSfxs = dayArr.map(
      (d) => `-${d * 24}hr_rain_${formatInTimeZone(subDays(dt, d - 1), 'Asia/Manila', 'yyyy-MM-dd_HH')}PHT.png`
    )
    const imgSubDirs = dayArr.map((d) => `${formatInTimeZone(subDays(dt, d - 1), 'UTC', 'yyyyMMdd/HH')}`)

    let res = filePfxs.reduce(
      (o, fPfx) => ({
        ...o,
        [fPfx]: fNameGen(`${resourceDir}/model/img/24hrly`, fPfx, fileSfxs, imgSubDirs),
      }),
      {}
    )

    const filePfxs2 = ['gsmap']
    const fileSfxs2 = [`-24hr_rain_${formatInTimeZone(dt, 'Asia/Manila', 'yyyy-MM-dd_HH')}PHT.png`]
    res = filePfxs2.reduce(
      (o, fPfx) => ({
        ...o,
        [fPfx]: fNameGen(`${resourceDir}/validation`, fPfx, fileSfxs2),
      }),
      res
    )

    const filePfxs3 = ['gfs', 'wrf_ensmean-gsmap', 'wrf_run1-gsmap', 'wrf_run2-gsmap', 'wrf_run3-gsmap', 'gfs-gsmap']
    const fileSfxs3 = dayArr.map(
      (d) => `-24hr_rain_day${d}_${formatInTimeZone(subDays(dt, d - 1), 'Asia/Manila', 'yyyy-MM-dd_HH')}PHT.png`
    )
    res = filePfxs3.reduce(
      (o, fPfx) => ({
        ...o,
        [fPfx.replace('-', '_')]: fNameGen(`${resourceDir}/validation`, fPfx, fileSfxs3),
      }),
      res
    )

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    return new Response(`Something went wrong in api/validation route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    })
  }
}
