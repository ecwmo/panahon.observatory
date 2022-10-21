import '@/tailwind.css'

import App from '@/App.vue'
import router from '@/router'
import VueGtag from 'vue-gtag'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueQueryPlugin } from 'vue-query'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(
  VueGtag,
  {
    config: { id: import.meta.env.VITE_GA_MEASUREMENT_ID },
  },
  router
)
app.use(VueQueryPlugin)
app.mount('#app')
