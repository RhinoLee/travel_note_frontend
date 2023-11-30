import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Notifications from '@kyvg/vue3-notification'
import VueUploadComponent from 'vue-upload-component/src/FileUpload.vue'
import registerGlobalDirective from './directives'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Notifications)
app.component('file-upload', VueUploadComponent)
registerGlobalDirective(app)

app.mount('#app')
