import type { Ref } from 'vue'
import useMapStore from '@/stores/map/map'
import { MapService } from '@/utils/map/MapService'

const mapStore = useMapStore()

// 掛載 Google Maps & Google Maps API 基本設定
export async function useGoogleMapsLoader(mapElement: Ref<HTMLElement | undefined>) {
  const mapService = new MapService()
  const map = await mapService.loadMap(mapElement)

  const directionsRenderer = mapService.createDirectionsRenderer()

  directionsRenderer.setMap(map)
  mapStore.setMap(map)
  mapStore.setDirectionRenderer(directionsRenderer)
}
