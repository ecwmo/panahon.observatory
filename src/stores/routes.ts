import { atom } from 'nanostores'

const defaultPageName = 'index'

export const baseAPIPath = import.meta.env.PUBLIC_API_URL.replace(/\/$/, '')

export const apiRoute = (pathName?: string) => `${baseAPIPath}/${pathName ?? ''}`.replace(/\/$/, '')

export type Page = {
  name: string
  description: string
  label: string
  to: string
  visible?: boolean
  auth?: boolean
  parent?: string
}

export const pages: Page[] = [
  //make paths reusable, avoid hardcoding paths in project
  {
    name: defaultPageName,
    description: 'Latest Summaries - Weather Conditions and Maps',
    label: 'Quick View',
    to: '/',
  },
  { name: 'models', description: 'Model Results - Forecasts and Maps', label: 'Models', to: '/models' },
  { name: 'climate', description: 'Philippine Climate Information', label: 'Climate', to: '/climate' },
  { name: 'projection', description: 'projection', label: 'Projection', to: '/projection' },
  { name: 'reports', description: 'Tropical Cyclone Report', label: 'Reports', to: '/reports' },
  {
    name: 'new_report',
    description: 'Create New Report',
    label: 'Reports',
    to: '/reports/upload',
    parent: 'reports',
    auth: true,
    visible: false,
  },
  {
    name: 'publish_report',
    description: 'Publish New Report',
    label: 'Reports',
    to: '/reports/publish',
    parent: 'reports',
    auth: true,
    visible: false,
  },
  {
    name: 'published_report',
    description: 'Published Report',
    label: 'Reports',
    to: '/reports/published',
    parent: 'reports',
    auth: true,
    visible: false,
  },
  {
    name: 'ewb_quicklook',
    description: 'EWB Quicklook',
    label: 'EWB',
    to: '/ewb-quicklook',
    visible: false,
  },
  {
    name: 'validation',
    description: 'Validation',
    label: 'Validation',
    to: '/validation',
    visible: false,
  },
  // { name: 'faq', description: 'Frequently Asked Questions', label: 'FAQ', to: '/faq' },
  { name: 'login', description: 'Login Page', label: 'Login', to: '/login', visible: false },
]

const defaultPage = pages.find(({ name }) => name === defaultPageName)!

export const $activePage = atom<Page>(defaultPage)

export const setActivePage = (pathName: string) => {
  const newPage =
    pathName === '/'
      ? defaultPage
      : pages.filter(({ name }) => name !== defaultPage?.name).find(({ to }) => pathName === to)

  if (newPage) $activePage.set(newPage)
}
