import { ref } from 'vue'
import type { Ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

export async function useGoogleMapsLoader(mapElement: Ref<HTMLElement | undefined>) {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    language: 'zh-TW',
    region: 'TW',
    libraries: ['places']
  })

  await loader.load()

  const taiwanCenter = new google.maps.LatLng(23.97565, 120.9738819)
  const map = new google.maps.Map(mapElement.value as HTMLElement, {
    center: taiwanCenter,
    zoom: 8
  })

  const mapInstance = ref<google.maps.Map>(map)

  return mapInstance.value
}
