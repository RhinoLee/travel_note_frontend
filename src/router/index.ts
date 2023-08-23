import { createRouter, createWebHistory } from 'vue-router'
import { CSRF_TOKEN } from '@/common/constants'
import { getCookieValue } from '@/utils/getCookieValue'
import useUserStore from '@/stores/user/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'home' } },
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
        },
        {
          path: 'google_redirect_url',
          name: 'googleRedirectUrl',
          component: () => import('../views/entry/googleRedirect/GoogleRedirect.vue')
        }
      ]
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/Home.vue'),
      children: [],
      meta: { requiresAuth: true }
    },
    {
      path: '/trip/:trip_id/:tripDate',
      name: 'trip',
      component: () => import('@/views/trip/Trip.vue'),
      children: [],
      meta: { requiresAuth: true }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/user/UserPage.vue'),
      children: [],
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/notFound/NotFound.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  console.log('to', to)
  console.log('from', from)

  // 需要登入權限的頁面
  if (to.meta.requiresAuth) {
    const token = getCookieValue(CSRF_TOKEN)
    if (!token) {
      return { name: 'login' }
    }
    // get user info
    const userStore = useUserStore()
    if (!userStore.userInfo) {
      await userStore.getUserInfoAction()
    }
  }
  // 如果去到 redirect page，參數沒有 code 則導回登入頁
  if (to.name === 'googleRedirectUrl' && !to.query.code) {
    return { name: 'login' }
  }
})

export default router
