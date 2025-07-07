import { atom } from 'nanostores'

export const basePath = 'https://127.0.0.1:8000' //creates basePath
//import.meta.env.BASE_URL?.replace(/\/$/, '') to fix

export const _baseAPIPath = `${basePath}/api`
export const baseAPIPath = import.meta.env.PUBLIC_API_URL.replace(/\/$/, '')

export const route = (pathName?: string) => `${basePath}/${pathName ?? ''}`
export const _apiRoute = (pathName?: string) => `${_baseAPIPath}/${pathName ?? ''}`.replace(/\/$/, '')
export const apiRoute = (pathName?: string) => `${baseAPIPath}/${pathName ?? ''}`.replace(/\/$/, '')

interface Page {
  name: string
  description: string
  label: string
  to: string
  visible?: boolean
  auth?: boolean
  parent?: string
}
export const pages = atom<Page[]>([ //make paths reusable, avoid hardcoding paths in project
  {
    name: 'index',
    description: 'Latest Summaries - Weather Conditions and Maps',
    label: 'Quick View',
    to: route(),
  },
  { name: 'models', description: 'Model Results - Forecasts and Maps', label: 'Models', to: route('models') },
  { name: 'climate', description: 'Philippine Climate Information', label: 'Climate', to: route('climate') },
  { name: 'reports', description: 'Tropical Cyclone Report', label: 'Reports', to: route('reports') },
  {
    name: 'new_report',
    description: 'Create New Report',
    label: 'Reports',
    to: route('reports/upload'),
    parent: 'reports',
    auth: true,
    visible: false,
  },
  {
    name: 'ewb_quicklook',
    description: 'EWB Quicklook',
    label: 'EWB',
    to: route('ewb-quicklook'),
    visible: false,
  },
  {
    name: 'validation',
    description: 'Validation',
    label: 'Validation',
    to: route('validation'),
    visible: false,
  },
  // { name: 'faq', description: 'Frequently Asked Questions', label: 'FAQ', to: `route('faq') },
  { name: 'login', description: 'Login Page', label: 'Login', to: route('login'), visible: false },
])

export const activePage = atom({} as Page)
export const activePageURL = atom({} as URL)

const setActivePageURL = (payload: URL) => activePageURL.set(payload)

export const setActivePage = (payload: string) => {
  const nPageUrl = new URL(payload)
  const nPagePath = nPageUrl.pathname

  const defaultPage = pages.get().find(({ name }) => name === 'index')
  const newPage =
    nPagePath === route()
      ? defaultPage
      : pages
          .get()
          .filter(({ name }) => name !== 'index')
          .find(({ to }) => nPagePath === to) ?? { ...defaultPage, to: nPageUrl.pathname }

  setActivePageURL(nPageUrl)

  activePage.set(newPage)
}
