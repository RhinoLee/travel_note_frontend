export default {
  path: '/user',
  name: 'user',
  component: () => import('@/views/user/UserPage.vue'),
  children: [],
  meta: { requiresAuth: true }
}
