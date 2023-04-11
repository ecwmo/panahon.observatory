import { action, atom, computed } from 'nanostores'

import { createFetcherStore, isReady } from './fetcher'

import { ReportImages, Reports } from '@/schemas/report'
import { apiRoute } from '@/stores/routes'

const API_URL = apiRoute('reports')

export const viewMode = atom('latest')
export const setViewMode = action(viewMode, 'setViewMode', (viewMode, newValue: string) => viewMode.set(newValue))

const _reports = createFetcherStore([API_URL])
export const reports = computed([_reports], (res) => (isReady(res) ? Reports.parse(res.data) : undefined))

const _report = createFetcherStore([API_URL, '/', viewMode])
export const report = computed([_report], (res) => (isReady(res) ? ReportImages.parse(res.data) : undefined))
