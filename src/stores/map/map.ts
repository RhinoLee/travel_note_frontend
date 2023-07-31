import { defineStore } from 'pinia'
import { toRaw } from 'vue'

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
            customOpeningHours.push({
              day: weekdayMap[period.open.day] || undefined,
              open: period.open?.hours + ':' + period.open?.minutes,
              close: period.close?.hours + ':' + period.close?.minutes
            })
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
    }
  }
})

export default useMapStore
