import { createWebHistory, createRouter } from 'vue-router'
import Home from '@/views/Home.vue'
import Models from '@/views/Models.vue'

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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
