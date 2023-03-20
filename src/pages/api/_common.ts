import { parse } from 'date-fns'
import { readFile } from 'fs/promises'

import { route } from '@/stores/routes'

export const resourceDir = import.meta.env.APP_RES_DIR
export const resourcePath = route('resources')

export const getLatestDate = async (imgType = 'forecast') => {
  let jsonFile = `${resourceDir}/model/info.json`
  if (imgType === 'ewb') {
    jsonFile = `${resourceDir}/model/info_ewb.json`
  }

  const dt = JSON.parse(await readFile(jsonFile, 'utf8'))
  const dtStr = `${dt['year']}-${dt['month']}-${dt['day']}_${dt['hour']} +08`

  return parse(dtStr, 'yyyy-MM-dd_HH x', new Date())
}
