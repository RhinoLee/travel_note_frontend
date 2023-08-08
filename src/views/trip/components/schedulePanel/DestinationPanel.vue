<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useMapStore from '@/stores/map/map'

defineEmits(['addDestinationBtnClick'])

const mapStore = useMapStore()
const { getClickedPlaceDetail } = storeToRefs(mapStore)
const isVisibled = ref(false)

watch(getClickedPlaceDetail, (newVal) => {
  if (!newVal) return
  isVisibled.value = true
})

function closePanel() {
  isVisibled.value = false
  mapStore.setClickedPlaceId('')
  mapStore.setClickedPlaceDetail(null)
}
</script>

<template>
  <div
    v-if="getClickedPlaceDetail && isVisibled"
    class="absolute left-[420px] top-[50%] translate-y-[-50%] w-[360px] h-[780px] bg-white rounded-lg z-20 overflow-hidden"
  >
    <div class="w-full h-full">
      <!-- panel header -->
      <header class="flex justify-between py-[10px] px-[20px] bg-[var(--green-color-1)]">
        <button @click="closePanel"><img src="@/assets/images/icon/pure_cancel_icon.svg" /></button>
        <button
          @click="$emit('addDestinationBtnClick')"
          class="flex items-center border border-[var(--main-brand-color-1)] py-[8px] px-[24px] text-[var(--main-brand-color-1)] rounded-lg"
        >
          <img src="@/assets/images/icon/location_search_icon.svg" />
          <span class="ml-[4px]">加入行程</span>
        </button>
      </header>
      <div class="px-[20px] py-[10px]">
        <!-- place title -->
        <div class="mb-[10px]">
          <h3 class="text-2xl text-[var(--main-brand-color-1)]">
            {{ getClickedPlaceDetail.name }}
          </h3>
        </div>
        <!-- place image -->
        <div
          v-if="getClickedPlaceDetail.photos && getClickedPlaceDetail.photos[0]"
          class="mb-[20px] rounded-lg overflow-hidden"
        >
          <img
            class="w-full max-h-[200px] object-cover object-center"
            :src="getClickedPlaceDetail.photos[0].getUrl()"
          />
        </div>
        <!-- other place detail -->
        <div class="space-y-[16px] text-black tracking-widest">
          <!-- place address -->
          <div v-if="getClickedPlaceDetail.formatted_address">
            <h5>地址：</h5>
            <span>{{ getClickedPlaceDetail.formatted_address }}</span>
          </div>
          <!-- place phone number -->
          <div v-if="getClickedPlaceDetail.formatted_phone_number">
            <h5>聯絡電話：</h5>
            <span>{{ getClickedPlaceDetail.formatted_phone_number }}</span>
          </div>
          <!-- place open time -->
          <div v-if="getClickedPlaceDetail.customOpeningHours">
            <h5>營業時間：</h5>
            <div>
              <!-- open time item -->
              <div v-for="(item, idx) in getClickedPlaceDetail.customOpeningHours" :key="idx">
                <span>星期{{ item.day }}</span>
                <span>：</span>
                <span>{{ item.open }} ~ {{ item.close }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
