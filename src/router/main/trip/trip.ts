export default {
  path: '/trip/:tripId',
  name: 'trip',
  component: () => import('@/views/trip/Trip.vue'),
  children: [],
  meta: { requiresAuth: true }
}
