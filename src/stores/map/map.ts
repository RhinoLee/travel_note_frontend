import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import {
  DESTINATION_MARKERS_TYPE,
  SEARCH_MARKERS_TYPE,
  ALL_MARKERS_TYPE
} from '@/composables/map/constants'

interface IMapState {
  map: google.maps.Map | null
  directionsRenderer: google.maps.DirectionsRenderer | null
  searchMarkers: google.maps.Marker[]
  destinationMarkers: google.maps.Marker[]
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
    directionsRenderer: null,
    searchMarkers: [],
    destinationMarkers: [],
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
    setDirectionRenderer(renderer: google.maps.DirectionsRenderer) {
      this.directionsRenderer = renderer
    },
    stopMarkersAnimate(type: string) {
      switch (type) {
        case SEARCH_MARKERS_TYPE: {
          this.searchMarkers.forEach((marker) => {
            marker.setAnimation(null)
          })

          break
        }
        case DESTINATION_MARKERS_TYPE: {
          this.destinationMarkers.forEach((marker) => {
            marker.setAnimation(null)
          })

          break
        }
        case ALL_MARKERS_TYPE: {
          this.searchMarkers.forEach((marker) => {
            marker.setAnimation(null)
          })

          this.destinationMarkers.forEach((marker) => {
            marker.setAnimation(null)
          })

          break
        }
      }
    },
    setMapZoomLevel(level: number) {
      this.map?.setZoom(level)
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
    addMarker(marker: google.maps.Marker, type: string) {
      switch (type) {
        case SEARCH_MARKERS_TYPE: {
          this.searchMarkers.push(marker)
          break
        }
        case DESTINATION_MARKERS_TYPE: {
          this.destinationMarkers.push(marker)
        }
      }
    },
    hideMarkers(type: string) {
      switch (type) {
        case SEARCH_MARKERS_TYPE: {
          for (let i = 0; i < this.searchMarkers.length; i++) {
            toRaw(this.searchMarkers[i]).setMap(null)
          }
          break
        }
        case DESTINATION_MARKERS_TYPE: {
          for (let i = 0; i < this.destinationMarkers.length; i++) {
            toRaw(this.destinationMarkers[i]).setMap(null)
          }
        }
      }
    },
    deleteMarkers(type: string) {
      this.hideMarkers(type)

      switch (type) {
        case SEARCH_MARKERS_TYPE: {
          this.searchMarkers = []
          break
        }
        case DESTINATION_MARKERS_TYPE: {
          this.destinationMarkers = []
          break
        }
      }
    },
    displayDirectionPath(data: google.maps.Map | null) {
      this.directionsRenderer?.setMap(data)
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
