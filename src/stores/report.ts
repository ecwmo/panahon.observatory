import { nanoquery } from '@nanostores/query'
import { action, atom } from 'nanostores'
import { z } from 'zod'

import { ReportImages } from '@/schemas/report'
import { apiRoute } from '@/stores/routes'

const API_URL = apiRoute('report')

const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: async (...keys: string[]) => {
    let url = API_URL
    if (keys[0]?.length > 0) url = `${url}?view=${keys[0]}`
    return await axios.get(url).then(({ data }) => ReportImages.parse(data))
  },
})

export const viewMode = atom('')
export const reports = createFetcherStore<z.infer<typeof ReportImages>>([viewMode])

export const setViewMode = action(viewMode, 'setViewMode', (viewMode, newValue: string) => viewMode.set(newValue))
