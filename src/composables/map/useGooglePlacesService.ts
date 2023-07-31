import useMapStore from '@/stores/map/map'
const mapStore = useMapStore()

export function useGooglePlacesService(mapInstance: google.maps.Map) {
  const service: google.maps.places.PlacesService = new google.maps.places.PlacesService(
    mapInstance
  )
  const infowindow: google.maps.InfoWindow = new google.maps.InfoWindow()

  const createMarker = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry || !place.geometry.location) return

    const marker = new google.maps.Marker({
      map: mapInstance,
      position: place.geometry.location
    })

    google.maps.event.addListener(marker, 'click', () => {
      infowindow.setContent(place.name || '')
      infowindow.open({
        anchor: marker,
        map: mapInstance
      })

      mapStore.setClickedPlaceId(place.place_id || '')
    })

    mapStore.addMarker(marker)
  }

  const nearbySearchHandler = (request: google.maps.places.TextSearchRequest) => {
    mapStore.deleteMarkers()

    service.textSearch(
      request,
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          mapStore.setSearchResults(results)

          for (let i = 0; i < results.length; i++) {
            createMarker(results[i])
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
      fields: ['name', 'formatted_address', 'place_id', 'geometry', 'opening_hours', 'photos']
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

  return { nearbySearchHandler, getPlaceDetails }
}
