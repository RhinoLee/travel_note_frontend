import useMapStore from '@/stores/map/map'
import useTripsStore from '@/stores/trips/trips'
import type { IMarkerParmas } from '@/views/trip/config/types'
import type { IDayDestinationRes } from '@/services/trips/type'
import destination_marker_icon from '@/assets/images/icon/map/destination_marker_icon.svg'
import {
  CLICK_MARKER_ZOOM_LEVEL,
  ALL_MARKERS_TYPE,
  DESTINATION_MARKERS_TYPE,
  SEARCH_MARKERS_TYPE
} from './constants'

const mapStore = useMapStore()
const tripsStore = useTripsStore()

export function useGooglePlacesService(mapInstance: google.maps.Map) {
  const directionsService = new google.maps.DirectionsService()

  const service: google.maps.places.PlacesService = new google.maps.places.PlacesService(
    mapInstance
  )
  // const infowindow: google.maps.InfoWindow = new google.maps.InfoWindow()
  const taiwanCenter = new google.maps.LatLng(23.97565, 120.9738819)
  let mapZoomTimeout: null | number = null

  // 清空 markers
  const clearMarkers = (type: string) => {
    mapStore.deleteMarkers(type)
  }
  // marker animation
  const toggleBounce = (marker: google.maps.Marker) => {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null)
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE)
    }
  }
  // 隨機位移經緯度 - 處理相同點位重疊問題
  const addRandomOffset = (place: IDayDestinationRes) => {
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
  // 統整點擊 marker 後的操作
  const triggerMarkerHandler = ({
    marker,
    place_id,
    destinationId
  }: {
    marker: google.maps.Marker
    place_id: string
    destinationId: number | null
  }) => {
    // 先清除所有 marker 動畫
    mapStore.stopMarkersAnimate(ALL_MARKERS_TYPE)
    // 當下點擊 maker 加上動畫
    toggleBounce(marker)
    // 設定資料
    mapStore.setClickedPlaceId(place_id || '')
    tripsStore.setCurrentDestinationId(destinationId)
    // 地圖 zoom in
    if (mapZoomTimeout) clearTimeout(mapZoomTimeout)
    mapZoomTimeout = setTimeout(() => {
      const zoom = mapInstance.getZoom()
      if (zoom !== undefined && zoom < CLICK_MARKER_ZOOM_LEVEL)
        mapInstance.setZoom(CLICK_MARKER_ZOOM_LEVEL)
    }, 200)
  }

  // 點擊搜尋結果 marker 後的操作
  const cliclMarkerCallback = (
    e: Event,
    {
      place,
      marker
    }: {
      place: google.maps.places.PlaceResult
      marker: google.maps.Marker
    }
  ) => {
    triggerMarkerHandler({ marker, place_id: place.place_id || '', destinationId: null })
  }

  // 點擊行程目的地 marker 後的操作
  const clickDestinationMarkerCallback = (
    e: Event,
    {
      place,
      marker
    }: {
      place: IMarkerParmas
      marker: google.maps.Marker
    }
  ) => {
    triggerMarkerHandler({ marker, place_id: place.place_id, destinationId: place.id })
  }

  // 搜尋地點使用的 api
  const createSearchMarker = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry || !place.geometry.location) return

    const marker = new google.maps.Marker({
      map: mapInstance,
      position: place.geometry.location
    })

    google.maps.event.addListener(marker, 'click', (e: Event) =>
      cliclMarkerCallback(e, { place, marker })
    )

    mapStore.addMarker(marker, SEARCH_MARKERS_TYPE)
  }

  // 拿到 destination 後使用的 api
  const createDestinationMarkers = (places: IMarkerParmas[]) => {
    places.forEach((place, index) => {
      const marker = new google.maps.Marker({
        map: mapInstance,
        position: place.position,
        icon: destination_marker_icon,
        label: {
          text: `${index + 1}`,
          color: 'white',
          className: 'map-main-label'
        },
        title: String(place.id)
      })

      google.maps.event.addListener(marker, 'click', (e: Event) => {
        clickDestinationMarkerCallback(e, { place, marker })
      })
      mapStore.addMarker(marker, DESTINATION_MARKERS_TYPE)
    })
  }

  const nearbySearchHandler = (
    request: google.maps.places.TextSearchRequest,
    deleteMarker: boolean = true
  ) => {
    if (deleteMarker) clearMarkers(SEARCH_MARKERS_TYPE)

    service.textSearch(
      request,
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          mapStore.setSearchResults(results)

          for (let i = 0; i < results.length; i++) {
            createSearchMarker(results[i])
          }

          mapInstance.setCenter(results[0].geometry!.location!)
        } else {
          mapStore.setSearchResults([])
        }
      }
    )
  }

  const getPlaceDetails = (placeId: string) => {
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: ['name', 'formatted_address', 'place_id', 'geometry', 'photos']
    }

    service.getDetails(
      request,
      (
        place: google.maps.places.PlaceResult | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          mapInstance.setCenter(place.geometry!.location!)
          mapStore.setClickedPlaceDetail(place)
        } else {
          mapStore.setClickedPlaceDetail(null)
        }
      }
    )
  }
  /**
   * 用於 render 當日所有目的地點位
   * @param places - 目的地 array
   */
  const createMarkerByDestination = async (places: IDayDestinationRes[]) => {
    clearMarkers(DESTINATION_MARKERS_TYPE)
    clearMarkers(SEARCH_MARKERS_TYPE)

    // 找出重複的 place_id，有重複代表 user 同一天去同一個地方超過一次
    // 會產生 marker 重疊問題，需要位移
    const placeIdCounts = new Map()
    places.forEach((place) => {
      placeIdCounts.set(place.place_id, (placeIdCounts.get(place.place_id) || 0) + 1)
    })

    const computedPlaces = places.map((place) => {
      const { place_id, lat, lng } = place

      if (placeIdCounts.get(place_id) > 1) {
        return addRandomOffset(place)
      }
      return {
        place_id,
        position: { lat, lng },
        isDestination: true,
        id: place.id
      }
    })

    createDestinationMarkers(computedPlaces)
  }

  const calculateAndDisplayRoute = () => {
    if (!tripsStore.getDayDestinationsRouteParams) return tripsStore.setDirectionsLeg([])
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

  return {
    nearbySearchHandler,
    getPlaceDetails,
    taiwanCenter,
    createMarkerByDestination,
    clearMarkers,
    toggleBounce,
    triggerMarkerHandler,
    calculateAndDisplayRoute
  }
}
