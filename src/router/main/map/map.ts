export default {
  path: '/map',
  name: 'map',
  component: () => import('@/views/map/Map.vue'),
  children: [],
  meta: { requiresAuth: true }
}
