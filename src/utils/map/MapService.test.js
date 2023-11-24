import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MapService } from '@/utils/map/MapService'
import { ref } from 'vue'
import { JSDOM } from 'jsdom'
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
      options
    }))
  }
}

describe('MapService', () => {
  let mapService = null
  beforeEach(() => {
    mapService = new MapService()
  })

  it('should load the map correctly', async () => {
    const { document } = new JSDOM(`...`).window
    const mapElement = ref(document.createElement('div'))

    const map = await mapService.loadMap(mapElement)
    expect(map.options.center).toEqual({ lat: 23.97565, lng: 120.9738819 })
    expect(map.options.disableDefaultUI).toBe(true)
    expect(map.options.zoom).toBe(DEFAULT_ZOOM_LEVEL)
    expect(map.options.mapId).toBe(MAP_ID)
  })

  it('should create a DirectionsRenderer with suppressMarkers true', () => {
    const directionsRenderer = mapService.createDirectionsRenderer()

    // 檢查傳入的選項是否包含 suppressMarkers: true
    expect(directionsRenderer.options.suppressMarkers).toBe(true)
  })
})
