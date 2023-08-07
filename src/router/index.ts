import { createRouter, createWebHistory } from 'vue-router'
import { localStore } from '@/utils/webStorage'
import { LOGIN_TOKEN } from '@/common/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/entry',
      name: 'entry',
      component: () => import('../views/entry/EntryPage.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/entry/login/LoginPage.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/entry/register/RegisterPage.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from) => {
  console.log('to', to)
  console.log('from', from)
  // name is undefined => is dynamic route(require token)
  if (to.name === undefined) {
    const token = localStore.getItem(LOGIN_TOKEN)
    if (!token) {
      return { name: 'login' }
    }
  }
})

export default router
