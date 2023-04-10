import { parse } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { readdir } from 'fs/promises'

import { resourceDir } from '@/pages/_common'

export const parseDate = (fileName: string) => {
  const dtStr = `${
    fileName
      .split('/')
      .at(-1)
      .match(/[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}/)[0]
  } +08`
  return parse(dtStr, 'yyyy-MM-dd_HH x', new Date())
}

const getImageFiles = async () =>
  await readdir(`${resourceDir}/validation`)
    .then((fs) => fs.filter((f) => f.includes('wrf_ensmean-gsmap-24hr_rain_day1') && f.endsWith('.png')))
    .catch(() => [])

export const getDates = async () => {
  const imgs = await getImageFiles()

  return imgs
    .map(parseDate)
    .sort((a, b) => b - a)
    .map((dt) => formatInTimeZone(dt, 'Asia/Manila', 'yyyy-MM-dd'))
}

export const getLatestDate = async () => {
  const imgs = await getImageFiles()
  return imgs.map(parseDate).sort((a, b) => b - a)[0]
}
