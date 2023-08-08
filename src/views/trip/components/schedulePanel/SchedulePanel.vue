<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useGooglePlacesService } from '@/composables/map/useGooglePlacesService'
import useMapStore from '@/stores/map/map'

defineEmits(['addDestinationBtnClick'])

const mapStore = useMapStore()
const request = reactive<google.maps.places.TextSearchRequest>({
  radius: 500,
  query: '台東森林公園'
})

function searchPlaceHandler() {
  if (!mapStore.getMap) return
  const { nearbySearchHandler, taiwanCenter } = useGooglePlacesService(mapStore.getMap)
  request.location = taiwanCenter
  nearbySearchHandler(request)
}

// GPT input
const gptInput = ref('')
async function gptInputHandler() {
  mapStore.getOpenAPICompletion(gptInput.value)
}
</script>

<template>
  <div class="relative px-[40px] py-[35px] h-full">
    <slot></slot>
    <!-- gpt input -->
    <div
      class="flex items-center justify-center border border-[var(--main-brand-color-1)] mb-[20px] py-[8px] px-[10px] rounded-lg"
    >
      <div class="flex w-[34px]">
        <img
          class="border-r border-[var(--gray-color-2)] pr-[10px] w-full"
          src="@/assets/images/icon/location_search_icon.svg"
        />
      </div>
      <div class="grow">
        <input
          class="border-none px-[12px] w-full0"
          type="text"
          placeholder="gpt input"
          v-model.trim="gptInput"
          @keyup.enter="gptInputHandler"
        />
      </div>
      <button @click="gptInput = ''" class="cursor-pointer">
        <img src="@/assets/images/icon/pure_cancel_icon.svg" alt="X" />
      </button>
    </div>
    <!-- search google place -->
    <div
      class="flex items-center justify-center border border-[var(--main-brand-color-1)] py-[8px] px-[10px] rounded-lg"
    >
      <div class="flex w-[34px]">
        <img
          class="border-r border-[var(--gray-color-2)] pr-[10px] w-full"
          src="@/assets/images/icon/location_search_icon.svg"
        />
      </div>
      <div class="grow">
        <input
          class="border-none px-[12px] w-full"
          type="text"
          placeholder="搜尋目的地"
          v-model.trim="request.query"
          @keyup.enter="searchPlaceHandler"
        />
      </div>
      <button @click="request.query = ''">
        <img src="@/assets/images/icon/pure_cancel_icon.svg" alt="X" />
      </button>
    </div>
    <div class="flex items-center mt-[8px]">
      <img class="mr-[6px]" src="@/assets/images/icon/motor_icon.svg" />
      <a class="text-[var(--blue-color-1)] text-sm tracking-wider" href="#">google 導航行程</a>
    </div>
    <div class="mt-[24px] mb-[8px]">
      <h2 class="text-[var(--main-brand-color-1)] text-2xl tracking-wider">旅行名稱</h2>
    </div>
    <div>
      <select
        class="border border-[var(--secondary-brand-color-1)] w-full text-[var(--dark-color-1) tracking-wider rounded-lg focus:outline-0 focus:ring-0 focus:border-[var(--secondary-brand-color-1)]"
      >
        <option value="2021-10-04">2021/10/04（星期六）</option>
        <option value="2021-10-04">2021/10/04（星期六）</option>
        <option value="2021-10-04">2021/10/04（星期六）</option>
        <option value="2021-10-04">2021/10/04（星期六）</option>
      </select>
    </div>
  </div>
</template>

<style lang="less" scoped></style>