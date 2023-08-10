export default {
  path: '/trip/:trip_id/:tripDate',
  name: 'trip',
  component: () => import('@/views/trip/Trip.vue'),
  children: [],
  meta: { requiresAuth: true }
}
