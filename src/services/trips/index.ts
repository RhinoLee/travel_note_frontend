import $axios from '@/services'
import useUserStore from '@/stores/user/user'
const userStore = useUserStore()

export const createTripAPI = (data: FormData | null) => {
  if (!data) return new Error('data is null')
  if (!userStore.token) return new Error('token is null')

  return $axios.post({
    url: '/trip',
    data,
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })
}
