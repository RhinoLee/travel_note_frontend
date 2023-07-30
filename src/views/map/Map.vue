<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import SchedulePanel from './components/schedulePanel/SchedulePanel.vue'
import { useGoogleMapsLoader } from '@/composables/map/useGoogleMapsLoader'
import { useGooglePlacesService } from '@/composables/map/useGooglePlacesService'

const mapDom = ref<HTMLDivElement | undefined>(undefined)
const mapInstance = ref<google.maps.Map | null>(null)

onMounted(async () => {
  mapInstance.value = await useGoogleMapsLoader(mapDom)
  const taiwanCenter = new google.maps.LatLng(23.97565, 120.9738819)
  const {
    nearbySearchHandler,
    getPlaceDetails,
    searchResults,
    clickedPlaceId,
    clickedPlaceDetail
  } = useGooglePlacesService(mapInstance.value)
  const request = { location: taiwanCenter, radius: 500, query: '台東 牛肉麵' }
  nearbySearchHandler(request)

  watch(searchResults, (newVal) => {
    console.log('searchResults newVal', newVal)
  })

  watch(clickedPlaceId, (newVal) => {
    console.log('clickPlaceId newVal', newVal)
    if (newVal) {
      // call google place detail api
      getPlaceDetails(newVal)
    }
  })

  watch(clickedPlaceDetail, (newVal) => {
    console.log('clickPlaceDetail newVal', newVal)
  })
})
</script>

<template>
  <div class="grid grid-cols-[400px_1fr] w-full h-full">
    <!-- panel -->
    <div class="w-full h-full">
      <SchedulePanel></SchedulePanel>
    </div>
    <!-- map -->
    <div class="w-full h-full">
      <div class="w-full h-full" ref="mapDom"></div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
