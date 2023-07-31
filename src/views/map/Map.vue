<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import SchedulePanel from './components/schedulePanel/SchedulePanel.vue'
import { useGoogleMapsLoader } from '@/composables/map/useGoogleMapsLoader'
import { useGooglePlacesService } from '@/composables/map/useGooglePlacesService'
import useMapStore from '@/stores/map/map'

interface GooglePlacesService {
  nearbySearchHandler: (request: google.maps.places.TextSearchRequest) => void
  getPlaceDetails: (placeId: string) => void
}

const mapStore = useMapStore()
const mapDom = ref<HTMLDivElement | undefined>(undefined)
const googlePlacesService = ref<GooglePlacesService | null>(null)

onMounted(async () => {
  await useGoogleMapsLoader(mapDom)

  if (mapStore.getMap) {
    googlePlacesService.value = useGooglePlacesService(mapStore.getMap)
  } else {
    // 掛載失敗錯處理
  }
})

watch(
  () => mapStore.searchResults,
  (newVal) => {
    console.log('searchResults newVal', newVal)
  }
)

watch(
  () => mapStore.clickedPlaceId,
  (newVal) => {
    console.log('clickPlaceId newVal', newVal)
    if (newVal) {
      // call google place detail api
      googlePlacesService.value?.getPlaceDetails(newVal)
    }
  }
)

watch(
  () => mapStore.clickedPlaceDetail,
  (newVal) => {
    console.log('clickPlaceDetail newVal', newVal)
  }
)
</script>

<template>
  <div class="grid grid-cols-[400px_1fr] w-full h-full">
    <!-- panel -->
    <div class="w-full h-full">
      <SchedulePanel v-if="mapStore.getMap"></SchedulePanel>
    </div>
    <!-- map -->
    <div class="w-full h-full">
      <div class="w-full h-full" ref="mapDom"></div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
