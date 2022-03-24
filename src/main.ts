import '@/tailwind.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'weather-icons/css/weather-icons.css'
import 'weather-icons/css/weather-icons-wind.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faInfo, faCloudRain, faThermometerHalf, faWind, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faInfo, faCloudRain, faThermometerHalf, faWind, faCloudUploadAlt)
dom.watch()

const app = createApp(App)
app.component('fa-icon', FontAwesomeIcon)
app.use(router)
app.use(store)
app.mount('#app')
