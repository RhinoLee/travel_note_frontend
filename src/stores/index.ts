import { createPinia } from 'pinia'
import type { App } from 'vue'
import useUserStore from '@/stores/user/user'
const pinia = createPinia()

function registerPinia(app: App<Element>) {
  app.use(pinia)
}

export default registerPinia
