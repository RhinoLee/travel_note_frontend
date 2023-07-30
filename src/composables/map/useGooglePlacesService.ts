import { ref } from 'vue'

export function useGooglePlacesService(mapInstance: google.maps.Map) {
  const service: google.maps.places.PlacesService = new google.maps.places.PlacesService(
    mapInstance
  )
  const infowindow: google.maps.InfoWindow = new google.maps.InfoWindow()
  const searchResults = ref<google.maps.places.PlaceResult[] | null>(null)
  const clickedPlaceId = ref<string>('')
  const clickedPlaceDetail = ref<google.maps.places.PlaceResult | null>(null)

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

      clickedPlaceId.value = place.place_id || ''
    })
  }

  const nearbySearchHandler = (request: google.maps.places.TextSearchRequest) => {
    service.textSearch(
      request,
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          searchResults.value = results

          for (let i = 0; i < results.length; i++) {
            createMarker(results[i])
          }

          mapInstance.setCenter(results[0].geometry!.location!)
        } else {
          searchResults.value = []
        }
      }
    )
  }

  const getPlaceDetails = (placeId: string) => {
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: ['name', 'formatted_address', 'place_id', 'geometry']
    }

    service.getDetails(
      request,
      (
        place: google.maps.places.PlaceResult | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          mapInstance.setCenter(place.geometry!.location!)
          clickedPlaceDetail.value = place
        }
      }
    )
  }

  return { nearbySearchHandler, getPlaceDetails, searchResults, clickedPlaceId, clickedPlaceDetail }
}
