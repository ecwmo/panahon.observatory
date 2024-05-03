import { getLatestDate } from '@/lib/helper/api'

import { parse } from 'date-fns'
import { readFile } from 'fs/promises'

import * as common from '@/lib/helper/pages'

vi.mock('fs/promises')
vi.mock('@/stores/routes', () => ({
  route: vi.fn(),
}))

vi.spyOn(common, 'resourceDir', 'get').mockReturnValue('resource_dir')

const mReadFile = vi.mocked(readFile)

class CustomError extends Error implements NodeJS.ErrnoException {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

test('success', async () => {
  const year = '2024'
  const month = '04'
  const day = '30'
  const hour = '02'
  const dtJSON = {
    year,
    month,
    day,
    hour,
  }
  const dtStr = `${year}-${month}-${day}_${hour} +08`
  const dt = parse(dtStr, 'yyyy-MM-dd_HH X', new Date())
  mReadFile.mockResolvedValue(JSON.stringify(dtJSON))
  await expect(getLatestDate()).resolves.toEqual(dt)
  await expect(getLatestDate('forecast')).resolves.toEqual(dt)
  await expect(getLatestDate('ewb')).resolves.toEqual(dt)
  expect(mReadFile).toHaveBeenCalledWith(`${common.resourceDir}/model/info.json`, 'utf8')
  expect(mReadFile).toHaveBeenCalledWith(`${common.resourceDir}/model/info_ewb.json`, 'utf8')
})

describe('error', () => {
  test('json file not found', async () => {
    mReadFile.mockRejectedValueOnce(new CustomError('ENOENT', 'file not found'))
    await expect(getLatestDate('forecast')).resolves.toBeUndefined()
  })

  test('invalid json string', async () => {
    mReadFile.mockResolvedValueOnce('{"name": "John", "age": 30')
    await expect(getLatestDate('forecast')).resolves.toBeUndefined()
  })
})
