export default {
  path: '/trip/:tripId/:tripDate',
  name: 'trip',
  component: () => import('@/views/trip/Trip.vue'),
  children: [],
  meta: { requiresAuth: true }
}
