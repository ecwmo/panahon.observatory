import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  console.log(to)
  if (['/', '/validation/ts'].includes(to.path)) {
    import('mapbox-gl/dist/mapbox-gl.css')
  }
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { path: '/login', query: { redirect: to.fullPath } }
})

export default router
