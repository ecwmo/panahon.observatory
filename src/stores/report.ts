import { action, atom, computed } from 'nanostores'

import { createFetcherStore, isReady } from './fetcher'

import { ReportImages } from '@/schemas/report'
import { apiRoute } from '@/stores/routes'

const API_URL = apiRoute('report')

export const viewMode = atom('')
export const setViewMode = action(viewMode, 'setViewMode', (viewMode, newValue: string) => viewMode.set(newValue))

const _reports = createFetcherStore([API_URL, '?view=', viewMode])
export const reports = computed([_reports], (res) => (isReady(res) ? ReportImages.parse(res.data) : undefined))
