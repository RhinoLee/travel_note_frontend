import type { Ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import useMapStore from '@/stores/map/map'
import { DEFAULT_ZOOM_LEVEL } from './constants'

const mapStore = useMapStore()

// 掛載 Google Maps & Google Maps API 基本設定
export async function useGoogleMapsLoader(mapElement: Ref<HTMLElement | undefined>) {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    language: 'zh-TW',
    region: 'TW',
    libraries: ['places', 'marker']
  })

  await loader.load()

  const directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true
  })
  const taiwanCenter = new google.maps.LatLng(23.97565, 120.9738819)
  const map = new google.maps.Map(mapElement.value as HTMLElement, {
    center: taiwanCenter,
    zoom: DEFAULT_ZOOM_LEVEL,
    mapId: '1f3b2398b22831ea'
  })

  directionsRenderer.setMap(map)
  mapStore.setMap(map)
  mapStore.setDirectionRenderer(directionsRenderer)
}
