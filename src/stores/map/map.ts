import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { completionAPI } from '@/services/open_ai'
// import { useGooglePlacesService } from '@/composables/map/useGooglePlacesService'

interface IMapState {
  map: google.maps.Map | null
  markers: google.maps.Marker[]
  searchResults: google.maps.places.PlaceResult[] | null
  clickedPlaceId: string
  clickedPlaceDetail: google.maps.places.PlaceResult | null
}

interface IPlaceDetail extends google.maps.places.PlaceResult {
  customOpeningHours: {
    day?: string
    open?: string
    close?: string
  }[]
}

const useMapStore = defineStore({
  id: 'map',
  state: (): IMapState => ({
    map: null,
    markers: [],
    searchResults: [],
    clickedPlaceId: '',
    clickedPlaceDetail: null
  }),
  getters: {
    getMap(): google.maps.Map | null {
      return this.map
    },
    getClickedPlaceDetail(): IPlaceDetail | null {
      if (!this.clickedPlaceDetail) return null
      else {
        const customOpeningHours: { day: any; open: string; close: string | undefined }[] = []
        const weekdayMap: any = {
          0: 'ㄧ',
          1: '二',
          2: '三',
          3: '四',
          4: '五',
          5: '六',
          6: '日'
        }
        if (this.clickedPlaceDetail.opening_hours?.periods) {
          this.clickedPlaceDetail.opening_hours.periods.forEach((period) => {
            if (period.open && period.close) {
              customOpeningHours.push({
                day: weekdayMap[period.open.day] || undefined,
                open: period.open?.hours + ':' + period.open?.minutes,
                close: period.close?.hours + ':' + period.close?.minutes
              })
            }
          })
        }

        return { ...this.clickedPlaceDetail, customOpeningHours }
      }
    }
  },
  actions: {
    setMap(map: google.maps.Map) {
      this.map = map
    },
    setSearchResults(results: google.maps.places.PlaceResult[]) {
      this.searchResults = results
    },
    setClickedPlaceId(placeId: string) {
      this.clickedPlaceId = placeId
    },
    setClickedPlaceDetail(placeDetail: google.maps.places.PlaceResult | null) {
      this.clickedPlaceDetail = placeDetail
    },
    addMarker(marker: google.maps.Marker) {
      this.markers.push(marker)
    },
    hideMarkers() {
      for (let i = 0; i < this.markers.length; i++) {
        toRaw(this.markers[i]).setMap(null)
      }
    },
    deleteMarkers() {
      this.hideMarkers()
      this.markers = []
    },
    async getOpenAPICompletion(gptInput: string) {
      // const { nearbySearchHandler, taiwanCenter } = useGooglePlacesService(this.map!)
      // try {
      //   const result = await completionAPI(gptInput)
      //   if (result.success) {
      //     const allLocations: any[] = []
      //     Object.keys(result.data).forEach((key: string) => {
      //       console.log('result.data[key]', result.data[key])
      //       result.data[key].forEach((locationStr: string) => {
      //         allLocations.push(locationStr)
      //       })
      //     })
      //     console.log('allLocations', allLocations)
      //     for (const location of allLocations) {
      //       const request = { location: taiwanCenter, radius: 500, query: location }
      //       nearbySearchHandler(request, false)
      //     }
      //   }
      // } catch (error) {
      //   console.log(error)
      // }
    }
  }
})

export default useMapStore
