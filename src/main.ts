import '@/tailwind.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'weather-icons/css/weather-icons.css'
import 'weather-icons/css/weather-icons-wind.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import VueGtag from 'vue-gtag'

import { VueQueryPlugin } from 'vue-query'
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faInfo, faCloudRain, faThermometerHalf, faWind, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { useRegisterSW } from 'virtual:pwa-register/vue'

const intervalMS = 60 * 60 * 1000

const updateServiceWorker = useRegisterSW({
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update()
      }, intervalMS)
  },
})

library.add(faInfo, faCloudRain, faThermometerHalf, faWind, faCloudUploadAlt)
dom.watch()

const app = createApp(App)
app.component('fa-icon', FontAwesomeIcon)
app.use(router)
app.use(
  VueGtag,
  {
    config: { id: import.meta.env.VITE_GA_MEASUREMENT_ID },
  },
  router
)
app.use(VueQueryPlugin)
app.use(VueLoading)
app.mount('#app')
