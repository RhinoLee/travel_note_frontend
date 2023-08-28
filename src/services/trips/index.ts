import $axios from '@/services'
import type {
  IListParams,
  IDayTripParams,
  IDayDestinationParmas,
  IUpdateDayDestinationParams,
  CreateAITripDayParams
} from './type'

export const createTripAPI = (data: FormData | null) => {
  if (!data) return new Error('data is null')

  return $axios.post({
    url: '/trip',
    data
  })
}
export const getTripsApi = ({ limit, page }: IListParams) => {
  return $axios.get({
    url: `/trip/list?limit=${limit}&page=${page}`
  })
}

export const getTripApi = (trip_id: number) => {
  return $axios.get({
    url: `/trip?trip_id=${trip_id}`
  })
}

export const deleteTripAPI = (trip_id: number) => {
  return $axios.delete({
    url: `/trip/${trip_id}`
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
  })
}

export const deleteDestinationAPI = (tripday_destination_id: number) => {
  return $axios.delete({
    url: `/trip/destination/${tripday_destination_id}`
  })
}

// openAI createTripDayApi
export const createAITripDayAPI = (data: CreateAITripDayParams) => {
  return $axios.post(
    {
      url: `/openAI/createTripDay`,
      data
    },
    {
      requireLoadingPage: true
    }
  )
}
