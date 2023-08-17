import $axios from '@/services'
import useUserStore from '@/stores/user/user'
import type {
  IListParams,
  IDayTripParams,
  IDayDestinationParmas,
  IUpdateDayDestinationParams
} from './type'

const userStore = useUserStore()

export const createTripAPI = (data: FormData | null) => {
  if (!data) return new Error('data is null')
  // if (!userStore.token) return new Error('token is null')

  return $axios.post({
    url: '/trip',
    data
  })
}
export const getTripsApi = ({ limit, page }: IListParams) => {
  // if (!userStore.token) return new Error('token is null')

  return $axios.get({
    url: `/trip/list?limit=${limit}&page=${page}`
  })
}

export const getTripApi = (trip_id: string) => {
  // if (!userStore.token) return new Error('token is null')

  return $axios.get({
    url: `/trip?trip_id=${trip_id}`
  })
}

export const createTripDayApi = (data: IDayTripParams) => {
  return $axios.post({
    url: `/trip/${data.trip_id}`,
    data
  })
}

export const getTripDayWithDestinationAPI = (data: IDayDestinationParmas) => {
  return $axios.get({
    url: `/trip/${data.trip_id}/${data.trip_date}`
  })
}

export const updateTripDayWithDestinationAPI = (data: IUpdateDayDestinationParams) => {
  if (!data) return
  const { arrival_time, leave_time, name, trip_date } = data
  return $axios.put({
    url: `/trip/${data.trip_id}/${data.id}`,
    data: { arrival_time, leave_time, name, trip_date }
    // headers: {
    //   // Authorization: `Bearer ${userStore.token}`
    //   'X-CSRF-Token': userStore.csrfToken
    // }
  })
}
