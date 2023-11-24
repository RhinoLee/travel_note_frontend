import type { Ref } from 'vue'
import useMapStore from '@/stores/map/map'
import { MapService } from '@/utils/map/MapService'
import { PlacesService } from '@/utils/map/PlacesService'
import { MarkerService } from '@/utils/map/MarkerService'

const mapStore = useMapStore()

// 掛載 Google Maps & Google Maps API 基本設定
export async function useGoogleMapsLoader(mapElement: Ref<HTMLElement | undefined>) {
  const mapService = new MapService()
  const map = await mapService.loadMap(mapElement)
  mapStore.setMap(map)

  const markerService = new MarkerService(mapService)
  mapStore.setMarkerService(markerService)

  const placeService = new PlacesService(mapService)
  mapStore.setPlaceService(placeService)

  const directionsRenderer = mapService.createDirectionsRenderer()
  mapStore.setDirectionRenderer(directionsRenderer)
}
