import { Loader } from '@googlemaps/js-api-loader'
import { DEFAULT_ZOOM_LEVEL, MAP_ID } from '@/composables/map/constants'
import type { Ref } from 'vue'

export class MapService {
  private loader: Loader
  private _mapInstance: google.maps.Map | null = null
  private _directionsRenderer: google.maps.DirectionsRenderer | null = null

  public get mapInstance(): google.maps.Map | null {
    return this._mapInstance
  }
  private set mapInstance(value: google.maps.Map) {
    this._mapInstance = value
  }

  public get directionsRenderer(): google.maps.DirectionsRenderer | null {
    return this._directionsRenderer
  }
  private set directionsRenderer(value: google.maps.DirectionsRenderer | null) {
    this._directionsRenderer = value
  }

  constructor() {
    this.loader = new Loader({
      apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      language: 'zh-TW',
      region: 'TW',
      libraries: ['places', 'marker']
    })
  }

  async getGoogleInstace() {
    return await this.loader.load()
  }

  async loadMap(mapElement: Ref<HTMLElement | undefined>) {
    await this.getGoogleInstace()

    this.mapInstance = new google.maps.Map(mapElement.value as HTMLElement, {
      center: new google.maps.LatLng(23.97565, 120.9738819),
      zoom: DEFAULT_ZOOM_LEVEL,
      mapId: MAP_ID,
      disableDefaultUI: true
    })

    return this.mapInstance
  }

  createDirectionsRenderer() {
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true // 阻止 DirectionsRenderer 自動在路徑的起點和終點顯示標記
    })

    this.directionsRenderer.setMap(this.mapInstance)

    return this.directionsRenderer
  }
}
