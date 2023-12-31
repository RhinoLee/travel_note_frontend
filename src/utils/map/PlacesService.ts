import { SEARCH_MARKERS_TYPE } from '@/composables/map/constants'
import type { MapService } from '@/utils/map/MapService'
import { MarkerService } from '@/utils/map/MarkerService'
import useMapStore from '@/stores/map/map'
import useTripsStore from '@/stores/trips/trips'
import type { IDayDestinationRes } from '@/services/trips/type'

const mapStore = useMapStore()
const tripsStore = useTripsStore()

export class PlacesService {
  private mapService: MapService
  private service: google.maps.places.PlacesService | undefined
  private markerService: MarkerService | undefined
  taiwanCenter: google.maps.LatLng | undefined

  constructor(mapService: MapService) {
    // 之後考慮從 store 取得，就可以不用傳參數
    this.mapService = mapService
    if (mapService.mapInstance) {
      this.service = new google.maps.places.PlacesService(mapService.mapInstance)
      this.taiwanCenter = new google.maps.LatLng(23.97565, 120.9738819)
      this.markerService = mapStore.markerService as MarkerService
    }
  }

  nearbySearchHandler(request: google.maps.places.TextSearchRequest, deleteMarker: boolean = true) {
    if (!this.service) return
    if (deleteMarker) this.markerService?.clearMarkers(SEARCH_MARKERS_TYPE)

    this.service.textSearch(
      request,
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          mapStore.setSearchResults(results)

          for (let i = 0; i < results.length; i++) {
            this.markerService?.createSearchMarker(results[i])
          }

          this.mapService.mapInstance?.setCenter(results[0].geometry!.location!)
        } else {
          mapStore.setSearchResults([])
        }
      }
    )
  }

  getPlaceDetails(placeId: string) {
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: ['name', 'formatted_address', 'place_id', 'geometry', 'photos']
    }

    this.service?.getDetails(
      request,
      (
        place: google.maps.places.PlaceResult | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          this.mapService.mapInstance?.setCenter(place.geometry!.location!)
          mapStore.setClickedPlaceDetail(place)
        } else {
          mapStore.setClickedPlaceDetail(null)
        }
      }
    )
  }

  handleRepeatPlaces(places: IDayDestinationRes[]) {
    // 找出重複的 place_id，有重複代表 user 同一天去同一個地方超過一次
    // 會產生 marker 重疊問題，需要位移
    const placeIdCounts = new Map()
    places.forEach((place) => {
      placeIdCounts.set(place.place_id, (placeIdCounts.get(place.place_id) || 0) + 1)
    })

    const computedPlaces = places.map((place) => {
      const { place_id, lat, lng } = place

      if (placeIdCounts.get(place_id) > 1) {
        return this.addRandomOffset(place)
      }

      return {
        place_id,
        position: { lat, lng },
        isDestination: true,
        id: place.id
      }
    })

    return computedPlaces
  }

  calculateAndDisplayRoute() {
    if (!tripsStore.getDayDestinationsRouteParams) return tripsStore.setDirectionsLeg([])
    const directionsService = new google.maps.DirectionsService()

    directionsService
      .route({
        origin: tripsStore.getDayDestinationsRouteParams?.origin,
        destination: tripsStore.getDayDestinationsRouteParams?.destination,
        waypoints: tripsStore.getDayDestinationsRouteParams?.waypoints,
        optimizeWaypoints: false,
        unitSystem: google.maps.UnitSystem.METRIC,
        travelMode: google.maps.TravelMode.DRIVING
      })
      .then((response) => {
        // 設定路徑結果到 renderer 上
        mapStore.directionsRenderer?.setDirections(response)
        // 顯示 direction path
        mapStore.displayDirectionPath(mapStore.map)
        const legs = response.routes[0].legs
        tripsStore.setDirectionsLeg(legs)
        console.log('map route response', response)
      })
      .catch((err) => {
        tripsStore.setDirectionsLeg([])
        console.log(err)
      })
  }

  // 隨機位移經緯度 - 處理相同點位重疊問題
  addRandomOffset(place: IDayDestinationRes) {
    const offset = 0.0001

    const { place_id, lat, lng } = place
    return {
      place_id,
      position: {
        lat: lat + (Math.random() - 0.5) * offset,
        lng: lng + (Math.random() - 0.5) * offset
      },
      isDestination: true,
      id: place.id
    }
  }
}
