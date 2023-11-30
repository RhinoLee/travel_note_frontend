import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MapService } from '@/utils/map/MapService'
import { ref } from 'vue'
import { DEFAULT_ZOOM_LEVEL, MAP_ID } from '@/composables/map/constants'

// 模擬 @googlemaps/js-api-loader 中的 Loader 行為
vi.mock('@googlemaps/js-api-loader', () => ({
  Loader: vi.fn().mockImplementation(() => ({
    load: vi.fn().mockResolvedValue(undefined)
  }))
}))

// 定義 const mapService = new MapService() 裡面用到的 google
global.google = {
  maps: {
    Map: vi.fn().mockImplementation((element, options) => ({
      element,
      options
    })),
    LatLng: vi.fn().mockImplementation((lat, lng) => ({ lat, lng })),
    DirectionsRenderer: vi.fn().mockImplementation((options) => ({
      options,
      setMap: vi.fn()
    }))
  }
}

describe('MapService', () => {
  let mapService = null
  let mapElement = null
  beforeEach(() => {
    mapElement = ref(document.createElement('div'))
    mapService = new MapService()
  })

  it('should load the map correctly', async () => {
    const map = await mapService.loadMap(mapElement)
    expect(map.options.center).toEqual({ lat: 23.97565, lng: 120.9738819 })
    expect(map.options.disableDefaultUI).toBe(true)
    expect(map.options.zoom).toBe(DEFAULT_ZOOM_LEVEL)
    expect(map.options.mapId).toBe(MAP_ID)
  })

  it('should create a DirectionsRenderer correctly', async () => {
    await mapService.loadMap(mapElement)
    mapService.createDirectionsRenderer()

    // 確認模擬的 DirectionsRenderer 已被創建
    expect(vi.mocked(google.maps.DirectionsRenderer)).toHaveBeenCalled()

    // 模擬 DirectionsRenderer 實例
    const mockDirectionsRendererInstance = vi.mocked(google.maps.DirectionsRenderer).mock.results[0]
      .value

    // 檢查 setMap 是否被執行
    expect(mockDirectionsRendererInstance.setMap).toHaveBeenCalled()

    // 檢查傳入的選項是否包含 suppressMarkers: true
    expect(mockDirectionsRendererInstance.options.suppressMarkers).toBe(true)
  })
})
