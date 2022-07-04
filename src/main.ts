import '@/tailwind.css'

import App from '@/App.vue'
import router from '@/router'
import VueGtag from 'vue-gtag'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueQueryPlugin } from 'vue-query'

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import {
  faInfo,
  faCloudRain,
  faThermometerHalf,
  faWind,
  faCloudUploadAlt,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

library.add(faInfo, faCloudRain, faThermometerHalf, faWind, faCloudUploadAlt, faXmark)
dom.watch()

const app = createApp(App)
//@ts-ignore
app.component('fa-icon', FontAwesomeIcon)
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
