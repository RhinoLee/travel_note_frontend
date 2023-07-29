import './assets/main.css'

import { createApp } from 'vue'
import registerPinia from './stores'

import App from './App.vue'
import router from './router'

import Notifications from '@kyvg/vue3-notification'

const app = createApp(App)

app.use(registerPinia)
app.use(router)
app.use(Notifications)

app.mount('#app')
