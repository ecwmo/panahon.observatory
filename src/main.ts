import '@/tailwind.css'

import { DefineComponent } from 'vue'
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
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

library.add(
  faInfo,
  faCloudRain,
  faThermometerHalf,
  faWind,
  faCloudUploadAlt,
  faXmark,
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faTriangleExclamation
)
dom.watch()

const app = createApp(App)

// https://github.com/FortAwesome/vue-fontawesome/issues/295#issuecomment-823411585
app.component('fa-icon', FontAwesomeIcon as unknown as DefineComponent<FontAwesomeIconProps>)
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
