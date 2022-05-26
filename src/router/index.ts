import { createWebHistory, createRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth'

const Home = () => import('@/views/Home.vue')
const Models = () => import('@/views/Models.vue')
const Climate = () => import('@/views/Climate.vue')
const Report = () => import('@/views/Report.vue')

const NewReport = () => import('@/views/NewReport.vue')

const Login = () => import('@/views/auth/Login.vue')

const FAQ = () => import('@/views/Faq.vue')

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
    meta: { requiresAuth: true },
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

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { path: '/login', query: { redirect: to.fullPath } }
})

export default router
