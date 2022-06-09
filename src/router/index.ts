import { createWebHistory, createRouter } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.name === 'index') {
    import('mapbox-gl/dist/mapbox-gl.css')
    import('weather-icons/css/weather-icons.css')
    import('weather-icons/css/weather-icons-wind.css')
  }
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { path: '/login', query: { redirect: to.fullPath } }
})

export default router
