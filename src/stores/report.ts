import { action, atom, computed } from 'nanostores'

import { createFetcherStore, isReady } from './fetcher'

import { ReportImages } from '@/schemas/report'
import { apiRoute } from '@/stores/routes'
import type { Report } from '@/types/report'

const API_URL = apiRoute('reports')

export const viewMode = atom('latest')
export const setViewMode = action(viewMode, 'setViewMode', (viewMode, newValue: string) => viewMode.set(newValue))

const skipReports = atom('0')
const setSkipReports = action(skipReports, 'setSkipReports', (skip, payload: string) => skip.set(payload))

const takeReports = atom('5')
const setTakeReports = action(takeReports, 'setTakeReports', (take, payload: string) => take.set(payload))

export const reports = atom<Report[]>([])
const setReports = action(reports, 'setReports', (target, payload: Report[]) => {
  if (payload.length > 0) {
    target.set([...target.get(), ...payload])
  }
})

const hasMoreReports = atom(true)
const setHasMoreReports = action(hasMoreReports, 'setHasMoreReports', (h, payload: boolean) => h.set(payload))

const reportsPartial = createFetcherStore<Report[]>([API_URL, '?take=', takeReports, '&skip=', skipReports])
reportsPartial.subscribe((r) => {
  if (isReady(r)) {
    setReports(r.data)
    setHasMoreReports(r.data.length === +takeReports.get())
  }
})

export const fetchNewReports = () => {
  if (hasMoreReports.get()) {
    setSkipReports(`${reports.get().length}`)
  }
}

const _report = createFetcherStore([API_URL, '/', viewMode])
export const report = computed([_report], (res) => (isReady(res) ? ReportImages.parse(res.data) : undefined))
