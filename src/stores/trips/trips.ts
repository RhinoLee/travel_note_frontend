import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { ITripParams } from '@/services/trips/type'
import { createTripAPI } from '@/services/trips'

interface IState {
  trips: any[]
  createData: ITripParams | null
}

const useTripsStore = defineStore({
  id: 'trips',
  state: (): IState => ({
    trips: [],
    createData: null
  }),
  getters: {
    getCreateData(): FormData | null {
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
          } else if (key === 'startDate' || key === 'endDate') {
            formatData[key] = dayjs(this.createData[key]).toISOString()
          } else {
            formatData[key] = this.createData[key]
          }
        }

        formData.append(key, (formatData as any)[key])
      })

      return formData
    }
  },
  actions: {
    setCreateData(data: any) {
      this.createData = data
    },
    async createTrip() {
      // use getCreateData to call api
      try {
        const result = await createTripAPI(this.getCreateData)
        return result
      } catch (err) {
        console.log(err)
        throw err
      }
    }
  }
})

export default useTripsStore
