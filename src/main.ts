import './assets/main.css'

import { createApp } from 'vue'
import registerPinia from './stores'

import App from './App.vue'
import router from './router'

import Notifications from '@kyvg/vue3-notification'
import VueUploadComponent from 'vue-upload-component/src/FileUpload.vue'
import registerGlobalDirective from './directives'

const app = createApp(App)

app.use(registerPinia)
app.use(router)
app.use(Notifications)
app.component('file-upload', VueUploadComponent)
registerGlobalDirective(app)

app.mount('#app')
