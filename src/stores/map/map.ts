import { defineStore } from 'pinia'
import { toRaw } from 'vue'

interface MapState {
  map: google.maps.Map | null
  markers: google.maps.Marker[]
  searchResults: google.maps.places.PlaceResult[] | null
  clickedPlaceId: string
  clickedPlaceDetail: google.maps.places.PlaceResult | null
}

const useMapStore = defineStore({
  id: 'map',
  state: (): MapState => ({
    map: null,
    markers: [],
    searchResults: [],
    clickedPlaceId: '',
    clickedPlaceDetail: null
  }),
  getters: {
    getMap(): google.maps.Map | null {
      return this.map
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
