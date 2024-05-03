import { format, parse } from 'date-fns'
import { readdir } from 'fs/promises'
import { z } from 'zod'

import { resourceDir } from '@/lib/helper/pages'

export const stationSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
})

export const parseDate = async (dtStr: string | null | undefined) => {
  let dtStrOut = dtStr
  if (!dtStr || dtStr?.length !== 8) {
    const imgFile = await readdir(`${resourceDir}/validation`).then(
      (imgs) => imgs.filter((f) => f.includes('wrf_ensmean-gsmap-24hr_rain_day1') && f.endsWith('.png'))?.[0]
    )

    const dt = parse(
      `${imgFile?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)?.[0] ?? format(Date.now(), 'yyyy-MM-dd')}_08 +08`,
      'yyyy-MM-dd_HH X',
      new Date()
    )

    dtStrOut = format(dt, 'yyyyMMdd')
  }
  return parse(`${dtStrOut}_08 +08`, 'yyyyMMdd_HH X', new Date())
}

export const getImgFile = (stnName: string, dt: Date) =>
  `validation_aws_combined_${stnName.replace(/\ /g, '_')}_${format(dt, 'yyy-MM-dd_HH')}PHT.png`
