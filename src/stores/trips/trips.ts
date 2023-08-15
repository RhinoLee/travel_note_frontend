import { defineStore } from 'pinia'
import { notify } from '@kyvg/vue3-notification'
import {
  EDIT_SUCCESS_MESSAGE,
  EDIT_FALIED_MESSAGE,
  CREATE_SUCCESS_MESSAGE,
  CREATE_FAILED_MESSAGE
} from '@/common/constants'

import {
  createTripAPI,
  getTripsApi,
  getTripApi,
  createTripDayApi,
  getTripDayWithDestinationAPI,
  updateTripDayWithDestinationAPI
} from '@/services/trips'
import {
  formatTime,
  formatDateToUTC,
  dateToLocalDate,
  generateDateRange,
  timeToLocalTime
} from '@/utils/formatDateTime'
import useMapStore from '@/stores/map/map'
import type {
  ITripParams,
  IListItem,
  IListResItem,
  IListParams,
  IListRes,
  IDayTripParams,
  IDayDestinationRes,
  IDestinationWithDistanceInfo,
  IEditDayDestination,
  IUpdateDayDestinationId
} from '@/services/trips/type'

interface IState {
  currentTrip: IListItem | null
  currentDestinationId: number | null
  trips: IListItem[]
  createData: ITripParams | null
  createTripDayData: any
  editDayDestination: any
  currentDayDestination: IUpdateDayDestinationId | null
  dayDestinationsData: IDayDestinationRes[]
  directionsLeg: google.maps.DirectionsLeg[]
}

const useTripsStore = defineStore({
  id: 'trips',
  state: (): IState => ({
    currentTrip: null,
    currentDestinationId: null,
    trips: [],
    createData: null,
    createTripDayData: null,
    editDayDestination: null,
    currentDayDestination: null,
    dayDestinationsData: [],
    directionsLeg: []
  }),
  getters: {
    getCreateTripParams(): FormData | null {
      if (!this.createData) return null
      const formatData = {} as ITripParams
      const formData = new FormData()

      // 設定 formData 資料
      ;(Object.keys(this.createData) as Array<keyof ITripParams>).forEach((key) => {
        if (this.createData) {
          if (key === 'tripImage') {
            const item = this.createData[key]
            if (Array.isArray(item)) {
              const file = item[0]?.file
              formatData[key] = file || null
            }
          } else if (key === 'start_date' || key === 'end_date') {
            formatData[key] = formatDateToUTC(this.createData[key])
          } else {
            formatData[key] = this.createData[key]
          }
        }

        formData.append(key, (formatData as any)[key])
      })

      return formData
    },
    getTrips(): IListItem[] {
      const computedTrips = this.trips.map((trip) => {
        trip.start_date = dateToLocalDate(trip.start_date)
        trip.end_date = dateToLocalDate(trip.end_date)
        return {
          ...trip
        }
      })
      return computedTrips
    },
    getCreateTripDayParams(): IDayTripParams | null {
      const mapStore = useMapStore()
      if (!mapStore.getClickedPlaceDetail) return null

      const { formatted_address, place_id, geometry } = mapStore.getClickedPlaceDetail
      const { name, trip_date, arrival_time, leave_time } = this.createTripDayData
      const params = {
        trip_id: this.currentTrip?.id,
        trip_date: formatDateToUTC(trip_date),
        name,
        address: formatted_address,
        place_id,
        lat: geometry?.location?.lat(),
        lng: geometry?.location?.lng(),
        arrival_time: formatTime(arrival_time, trip_date),
        leave_time: formatTime(leave_time, trip_date),
        visit_order: 0
      }

      return params as IDayTripParams
    },
    getEditDayDestination(): IEditDayDestination | null {
      if (!this.editDayDestination) return null

      const {
        name,
        arrival_time: arrival,
        leave_time: leave,
        trip_date: date
      } = this.editDayDestination

      const arrival_time = formatTime(arrival, date)
      const leave_time = formatTime(leave, date)
      const trip_date = formatDateToUTC(date)

      return { name, arrival_time, leave_time, trip_date }
    },
    getTripDaysSelectOptions(): { date: string; weekday: string }[] {
      if (!this.currentTrip) return []
      const { start_date, end_date } = this.currentTrip
      console.log(
        'generateDateRange(start_date, end_date)',
        generateDateRange(start_date, end_date)
      )

      return generateDateRange(start_date, end_date)
    },
    getDayDestinationsData(): IDestinationWithDistanceInfo[] {
      const arr = this.dayDestinationsData.map((data, index) => {
        return {
          ...data,
          leg: this.directionsLeg[index]
        }
      })

      return arr
    },
    // 整理 google maps directive api params
    getDayDestinationsRouteParams() {
      if (!this.dayDestinationsData || this.dayDestinationsData.length < 2) return null
      const destinations: IDayDestinationRes[] = this.dayDestinationsData
      const [originData, ...rest] = destinations
      const destinationData = rest.pop()

      const convertData = (data: IDayDestinationRes) => ({
        location: {
          lat: data.lat,
          lng: data.lng
        }
      })

      const origin = convertData(originData)
      const destination = convertData(destinationData as IDayDestinationRes)
      const waypoints = rest.map(convertData)

      return { origin, destination, waypoints }
    },
    getCurrentDayDestination(): IUpdateDayDestinationId | undefined {
      if (!this.currentTrip || !this.currentDayDestination) return
      const trip_id = this.currentTrip.id
      const id = this.currentDayDestination.id

      return { trip_id, id }
    }
  },
  actions: {
    setCurrentTrip(trip: IListItem) {
      this.currentTrip = trip
    },
    setCurrentDestinationId(id: number | null) {
      this.currentDestinationId = id
    },
    setCreateData(data: any) {
      this.createData = data
    },
    setTripDayData(data: any) {
      this.createTripDayData = data
    },
    setDayDestinationsData(data: IDayDestinationRes[]) {
      data.forEach((item) => {
        item.arrival_time = timeToLocalTime(item.trip_date, item.arrival_time)
        item.leave_time = timeToLocalTime(item.trip_date, item.leave_time)
      })
      this.dayDestinationsData = data
    },
    setDirectionsLeg(data: google.maps.DirectionsLeg[]) {
      this.directionsLeg = data
    },
    setEditDayDestination(data: IDayDestinationRes) {
      this.editDayDestination = data
    },
    setCurrentDayDestination(data: IUpdateDayDestinationId) {
      this.currentDayDestination = data
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
    async getTripAction(trip_id: string) {
      try {
        const result = await getTripApi(trip_id)
        this.setCurrentTrip(result.data)
      } catch (err) {
        console.log('getTripAction err', err)
        throw err
      }
    },
    async createTripDayAction() {
      if (!this.getCreateTripDayParams) return
      console.log('createTripDayAction params', this.getCreateTripDayParams)
      try {
        const result = await createTripDayApi(this.getCreateTripDayParams)
        if (result.success) {
          notify({ type: 'success', text: CREATE_SUCCESS_MESSAGE })
        } else {
          notify({ type: 'error', text: CREATE_FAILED_MESSAGE })
        }
        return result
      } catch (err) {
        console.log('createTripDayAction error: ', err)
        notify({ type: 'error', text: CREATE_FAILED_MESSAGE })
        throw err
      }
    },
    async getDayDestinationAction(trip_date: string) {
      if (!this.currentTrip) return
      try {
        const result = await getTripDayWithDestinationAPI({
          trip_id: this.currentTrip.id,
          trip_date
        })

        if (result.success) {
          this.setDayDestinationsData(result.data)
        }
        return result
      } catch (err) {
        console.log(err)
      }

      this.setDayDestinationsData([])
    },
    async updateTripDayWithDestinationAction() {
      if (!this.getCurrentDayDestination || !this.getEditDayDestination) return
      const params = {
        ...this.getCurrentDayDestination,
        ...this.getEditDayDestination
      }

      try {
        const result = await updateTripDayWithDestinationAPI(params)
        if (result.success) {
          this.setDayDestinationsData(result.data)
          notify({ type: 'success', text: EDIT_SUCCESS_MESSAGE })
        } else {
          notify({ type: 'error', text: EDIT_FALIED_MESSAGE })
        }
        console.log('updateTripDayWithDestinationAction result', result)

        return result
      } catch (err) {
        console.log(err)
        notify({ type: 'error', text: EDIT_FALIED_MESSAGE })
        throw err
      }
    }
  }
})

export default useTripsStore
