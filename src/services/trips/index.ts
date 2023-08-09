import $axios from '@/services'
import useUserStore from '@/stores/user/user'
import type { IListParams, IDayTripParams, IDayDestinationParmas } from './type'

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
export const getTripsApi = ({ limit, page }: IListParams) => {
  if (!userStore.token) return new Error('token is null')

  return $axios.get({
    url: `/trip/list?limit=${limit}&page=${page}`,
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })
}

export const getTripApi = (tripId: string) => {
  if (!userStore.token) return new Error('token is null')

  return $axios.get({
    url: `/trip?tripId=${tripId}`,
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })
}

export const createTripDayApi = (data: IDayTripParams) => {
  return $axios.post({
    url: `/trip/${data.tripId}`,
    data,
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })
}

export const getTripDayWithDestination = (data: IDayDestinationParmas) => {
  return $axios.get({
    url: `/trip/${data.tripId}/${data.trip_date}`,
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })
}
