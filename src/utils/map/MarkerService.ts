import type { MapService } from '@/utils/map/MapService'
import useMapStore from '@/stores/map/map'
import useTripsStore from '@/stores/trips/trips'
import {
  ALL_MARKERS_TYPE,
  CLICK_MARKER_ZOOM_LEVEL,
  DESTINATION_MARKERS_TYPE,
  SEARCH_MARKERS_TYPE
} from '@/composables/map/constants'
import destination_marker_icon from '@/assets/images/icon/map/destination_marker_icon.svg'
import type { IMarkerParmas } from '@/views/trip/config/types'
import type { IDayDestinationRes } from '@/services/trips/type'

const mapStore = useMapStore()
const tripsStore = useTripsStore()

export class MarkerService {
  private mapService: MapService | undefined
  private mapZoomTimeout: null | number = null

  constructor(mapService: MapService) {
    this.mapService = mapService
  }

  createSearchMarker(place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.geometry.location) return

    const marker = new google.maps.Marker({
      map: this.mapService?.mapInstance,
      position: place.geometry.location
    })

    google.maps.event.addListener(marker, 'click', (e: Event) =>
      this.cliclMarkerCallback(e, { place, marker })
    )

    mapStore.addMarker(marker, SEARCH_MARKERS_TYPE)
  }

  // 拿到 destination 後使用的 api
  createDestinationMarkers(places: IMarkerParmas[]) {
    places.forEach((place, index) => {
      const marker = new google.maps.Marker({
        map: this.mapService?.mapInstance,
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
        this.clickDestinationMarkerCallback(e, { place, marker })
      })
      mapStore.addMarker(marker, DESTINATION_MARKERS_TYPE)
    })
  }

  async createMarkerByDestination(places: IDayDestinationRes[]) {
    this.clearMarkers(DESTINATION_MARKERS_TYPE)
    this.clearMarkers(SEARCH_MARKERS_TYPE)

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

    this.createDestinationMarkers(computedPlaces)
  }

  // 點擊搜尋結果 marker 後的操作
  cliclMarkerCallback(
    e: Event,
    {
      place,
      marker
    }: {
      place: google.maps.places.PlaceResult
      marker: google.maps.Marker
    }
  ) {
    this.triggerMarkerHandler({ marker, place_id: place.place_id || '', destinationId: null })
  }

  // 點擊行程目的地 marker 後的操作
  clickDestinationMarkerCallback(
    e: Event,
    {
      place,
      marker
    }: {
      place: IMarkerParmas
      marker: google.maps.Marker
    }
  ) {
    this.triggerMarkerHandler({
      marker,
      place_id: place.place_id,
      destinationId: place.id
    })
  }

  // 統整點擊 marker 後的操作
  triggerMarkerHandler({
    marker,
    place_id,
    destinationId
  }: {
    marker: google.maps.Marker
    place_id: string
    destinationId: number | null
  }) {
    // 先清除所有 marker 動畫
    mapStore.stopMarkersAnimate(ALL_MARKERS_TYPE)
    // 當下點擊 maker 加上動畫
    this.toggleBounce(marker)
    // 設定資料
    mapStore.setClickedPlaceId(place_id || '')
    tripsStore.setCurrentDestinationId(destinationId)
    // 地圖 zoom in
    if (this.mapZoomTimeout) clearTimeout(this.mapZoomTimeout)
    this.mapZoomTimeout = setTimeout(() => {
      const zoom = this.mapService?.mapInstance?.getZoom()
      if (zoom !== undefined && zoom < CLICK_MARKER_ZOOM_LEVEL)
        this.mapService?.mapInstance?.setZoom(CLICK_MARKER_ZOOM_LEVEL)
    }, 200)
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

  toggleBounce(marker: google.maps.Marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null)
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE)
    }
  }

  clearMarkers(type: string) {
    mapStore.deleteMarkers(type)
  }
}
