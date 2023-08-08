import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { createTripAPI, getTripsApi, getTripApi, createTripDayApi } from '@/services/trips'
import { formatTime, formatDate } from '@/utils/formatDateTime'
import useMapStore from '@/stores/map/map'
import type {
  ITripParams,
  IListItem,
  IListResItem,
  IListParams,
  IListRes,
  IDayTripParams
} from '@/services/trips/type'

interface IState {
  currentTrip: IListItem | null
  trips: Array<IListItem>
  createData: ITripParams | null
  createTripDayData: any
  tripData: any
}

const useTripsStore = defineStore({
  id: 'trips',
  state: (): IState => ({
    currentTrip: null,
    trips: [],
    createData: null,
    createTripDayData: null,
    // api response data
    tripData: [
      {
        trip_date: '2021/10/04',
        destinations: [
          {
            name: '台東森林公園', // from google
            place_id: 'xxxx', // from google
            lat: 12.2222, //from google
            lng: 13.3333, // from google
            arrival_time: '10:00',
            leave_time: '14:00',
            visit_order: 0
          }
        ]
      },
      {
        trip_date: '2021/10/05'
      },
      {
        trip_date: '2021/10/06'
      }
    ]
  }),
  getters: {
    getCreateTripParams(): FormData | null {
      if (!this.createData) return null
      const formatData = {} as ITripParams
      const formData = new FormData()

      ;(Object.keys(this.createData) as Array<keyof ITripParams>).forEach((key) => {
        if (this.createData) {
          if (key === 'tripImage') {
            const item = this.createData[key]
            if (Array.isArray(item)) {
              const file = item[0]?.file
              formatData[key] = file || null
            }
          } else if (key === 'start_date' || key === 'end_date') {
            formatData[key] = dayjs(this.createData[key]).toISOString()
          } else {
            formatData[key] = this.createData[key]
          }
        }

        formData.append(key, (formatData as any)[key])
      })

      return formData
    },
    getTrips(): Array<IListItem> {
      return this.trips
    },
    getTripData(): any {
      return this.tripData
    },
    getCreateTripDayParams(): IDayTripParams | null {
      const mapStore = useMapStore()
      if (!mapStore.getClickedPlaceDetail) return null

      const { formatted_address, place_id, geometry } = mapStore.getClickedPlaceDetail
      const { name, trip_date, arrival_time, leave_time } = this.createTripDayData
      const params = {
        tripId: this.currentTrip?.id,
        trip_date: formatDate(trip_date.toISOString()),
        name,
        address: formatted_address,
        place_id,
        lat: geometry?.location?.lat(),
        lng: geometry?.location?.lng(),
        arrival_time: formatTime(arrival_time),
        leave_time: formatTime(leave_time),
        visit_order: 0
      }

      return params as IDayTripParams
    }
  },
  actions: {
    setCurrentTrip(trip: IListItem) {
      this.currentTrip = trip
    },
    setCreateData(data: any) {
      this.createData = data
    },
    setTripDayData(data: any) {
      this.createTripDayData = data
    },
    async createTrip() {
      // use getCreateTripParams to call api
      try {
        const result = await createTripAPI(this.getCreateTripParams)
        return result
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    async getTripsAction(params: IListParams) {
      try {
        const result: IListRes = await getTripsApi(params)
        this.trips = result.data.map((item: IListResItem) => {
          return {
            id: item.id,
            name: item.name,
            imageUrl: item.image_url,
            start_date: item.start_date,
            end_date: item.end_date
          }
        })
        return result
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    async getTripAction(tripId: string) {
      try {
        const result = await getTripApi(tripId)
        this.setCurrentTrip(result.data)
      } catch (err) {
        console.log('getTripAction err', err)
        throw err
      }
    },
    async createTripDayActions() {
      if (!this.getCreateTripDayParams) return
      console.log('createTripDayActions params', this.getCreateTripDayParams)
      try {
        const result = await createTripDayApi(this.getCreateTripDayParams)
        console.log('createTripDayActions result: ', result)
      } catch (err) {
        console.log('createTripDayActions error: ', err)
        throw err
      }
    }
  }
})

export default useTripsStore
