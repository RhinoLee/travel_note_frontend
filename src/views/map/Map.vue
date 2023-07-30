<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import { ref } from 'vue'
import type { Ref } from 'vue'

const loader = new Loader({
  apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  language: 'zh-TW',
  region: 'TW'
})

const mapInstance: Ref<google.maps.Map | undefined> = ref(undefined)
const mapDom = ref<HTMLDivElement | undefined>(undefined)

loader.load().then(async () => {
  mapInstance.value = new google.maps.Map(mapDom.value as HTMLElement, {
    center: { lat: 23.97565, lng: 120.9738819 },
    zoom: 8
  })
})
</script>

<template>
  <div class="w-full h-full">
    <div class="w-full h-full" ref="mapDom"></div>
  </div>
</template>

<style lang="less" scoped></style>
