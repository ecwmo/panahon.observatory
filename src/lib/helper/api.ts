import { parse } from 'date-fns'
import { readFile } from 'fs/promises'

import { resourceDir } from '@/lib/helper/pages'
import { instanceOfNodeError } from '@/lib/helper/error'

type DateImgType = 'forecast' | 'ewb'
export const getLatestDate = async (imgType: DateImgType = 'forecast') => {
  let jsonFile = `${resourceDir}/model/info.json`
  if (imgType === 'ewb') {
    jsonFile = `${resourceDir}/model/info_ewb.json`
  }

  try {
    const data = await readFile(jsonFile, 'utf8')
    const dt = JSON.parse(data)

    // indicate PHT
    const dtStr = `${dt['year']}-${dt['month']}-${dt['day']}_${dt['hour']} +08`

    return parse(dtStr, 'yyyy-MM-dd_HH X', new Date())
  } catch (err) {
    if (instanceOfNodeError(err, Error)) {
      if (err.code === 'ENOENT') {
        console.log('File does not exist.')
      } else {
        console.error('Error reading file:', err)
      }
    }
  }
}
