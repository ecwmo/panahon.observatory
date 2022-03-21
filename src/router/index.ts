import { createWebHistory, createRouter } from 'vue-router'

import Home from '@/views/Home.vue'
import Models from '@/views/Models.vue'
import Climate from '@/views/Climate.vue'
import Report from '@/views/Report.vue'

import NewReport from '@/views/NewReport.vue'

import Login from '@/views/auth/Login.vue'

import FAQ from '@/views/Faq.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/models',
    name: 'Models',
    component: Models,
  },
  {
    path: '/climate',
    name: 'Climate',
    component: Climate,
  },
  {
    path: '/report',
    name: 'Report',
    component: Report,
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQ,
  },
  {
    path: '/newreport',
    name: 'NewReport',
    component: NewReport,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
