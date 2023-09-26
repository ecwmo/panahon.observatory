import type { FetcherValue } from '@nanostores/query'
import { nanoquery } from '@nanostores/query'

export const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: (...keys: string[]) => fetch(keys.join('')).then((res) => res.json()),
})

export const isReady = (fs: FetcherValue) => {
  const { data, error, loading } = fs
  return !loading && error === undefined && data !== undefined
}
