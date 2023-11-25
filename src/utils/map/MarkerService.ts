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

interface SearchMarkerParams {
  place: google.maps.places.PlaceResult
  marker: google.maps.Marker
}

interface DestinationMarkerParams {
  place: IMarkerParmas
  marker: google.maps.Marker
}

interface TriggerMarkerParams {
  marker: google.maps.Marker
  place_id: string
  destinationId: number | null
}

export class MarkerService {
  private mapService: MapService | undefined
  private mapStore
  private tripsStore

  constructor(mapService: MapService) {
    this.mapService = mapService
    this.mapStore = useMapStore()
    this.tripsStore = useTripsStore()
  }

  private createMarker(options: google.maps.MarkerOptions) {
    const marker = new google.maps.Marker({
      ...options,
      map: this.mapService?.mapInstance
    })

    return marker
  }

  createSearchMarker(place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.geometry.location) return

    const marker = this.createMarker({
      position: place.geometry.location
    })

    marker.addListener('click', (e: Event) => this.clickSearchMarkerCallback(e, { place, marker }))

    this.mapStore.addMarker(marker, SEARCH_MARKERS_TYPE)
  }

  // 拿到 destination 後使用的 api
  private createDestinationMarkers(places: IMarkerParmas[]) {
    places.forEach((place, index) => {
      const marker = this.createMarker({
        position: place.position,
        icon: destination_marker_icon,
        label: {
          text: `${index + 1}`,
          color: 'white',
          className: 'map-main-label'
        },
        title: String(place.id)
      })

      marker.addListener('click', (e: Event) =>
        this.clickDestinationMarkerCallback(e, { place, marker })
      )

      this.mapStore.addMarker(marker, DESTINATION_MARKERS_TYPE)
    })
  }

  async createMarkerByDestination(places: IDayDestinationRes[]) {
    this.clearMarkers(DESTINATION_MARKERS_TYPE)
    this.clearMarkers(SEARCH_MARKERS_TYPE)

    // 處理重複位置，會產生 marker 重疊問題，需要位移
    const computedPlaces = this.mapStore.placeService?.handleRepeatPlaces(places)

    if (computedPlaces) this.createDestinationMarkers(computedPlaces)
  }

  // 點擊搜尋結果 marker 後的操作
  clickSearchMarkerCallback(e: Event, { place, marker }: SearchMarkerParams) {
    this.triggerMarkerHandler({ marker, place_id: place.place_id || '', destinationId: null })
  }

  // 點擊行程目的地 marker 後的操作
  clickDestinationMarkerCallback(e: Event, { place, marker }: DestinationMarkerParams) {
    this.triggerMarkerHandler({
      marker,
      place_id: place.place_id,
      destinationId: place.id
    })
  }

  // 統整點擊 marker 後的操作
  triggerMarkerHandler({ marker, place_id, destinationId }: TriggerMarkerParams) {
    // 先清除所有 marker 動畫
    this.mapStore.stopMarkersAnimate(ALL_MARKERS_TYPE)
    // 當下點擊 maker 加上動畫
    this.toggleBounce(marker)
    // 設定資料
    this.mapStore.setClickedPlaceId(place_id || '')
    this.tripsStore.setCurrentDestinationId(destinationId)
    // 地圖 zoom in
    this.mapService?.handleZoomIn(CLICK_MARKER_ZOOM_LEVEL)
  }

  toggleBounce(marker: google.maps.Marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null)
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE)
    }
  }

  clearMarkers(type: string) {
    this.mapStore.deleteMarkers(type)
  }
}
