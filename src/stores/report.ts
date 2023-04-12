import { action, atom, computed } from 'nanostores'
import { z } from 'zod'

import { createFetcherStore, isReady } from './fetcher'

import { ReportImages, Reports } from '@/schemas/report'
import { apiRoute } from '@/stores/routes'

const API_URL = apiRoute('reports')

export const viewMode = atom('latest')
export const setViewMode = action(viewMode, 'setViewMode', (viewMode, newValue: string) => viewMode.set(newValue))

interface Data {
  reports: z.infer<typeof Reports>
  nextId: string
}

const reportsCursor = atom('')
const setReportsCursor = action(reportsCursor, 'setReportsCursor', (cursor, payload: string) => cursor.set(payload))

const _reportsPaginated = createFetcherStore<Data>([API_URL, '?cursor=', reportsCursor])
export const reportsPaginated = computed([_reportsPaginated], (res) => {
  if (isReady(res)) {
    const { reports, nextId } = res.data
    return {
      data: Reports.parse(reports),
      nextId,
    }
  }
  return {
    data: [],
    nextId: undefined,
  }
})

export const fetchNewReports = () => {
  const { nextId } = _reportsPaginated.get().data
  setReportsCursor(nextId)
}

const _report = createFetcherStore([API_URL, '/', viewMode])
export const report = computed([_report], (res) => (isReady(res) ? ReportImages.parse(res.data) : undefined))
