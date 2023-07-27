import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
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
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home/Home.vue')
    }
  ]
})

export default router
