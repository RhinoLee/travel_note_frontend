<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useGooglePlacesService } from '@/composables/map/useGooglePlacesService'
import useMapStore from '@/stores/map/map'
import useTripsStore from '@/stores/trips/trips'
import type { IDayDestinationRes } from '@/services/trips/type'

const emit = defineEmits([
  'addDestinationBtnClick',
  'getDayTripDestination',
  'editDayDetination',
  'clickDestinationHandler'
])

const tripsStore = useTripsStore()
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

async function getDayTripDestination(e: Event) {
  const target = e.target as HTMLSelectElement
  const date = target.value
  emit('getDayTripDestination', date)
}

function editDayDetination(data: IDayDestinationRes) {
  const { id, trip_id } = data
  tripsStore.setCurrentDayDestination({ id, trip_id })
  const computedData = {
    arrival_time: {
      hours: data.arrival_time.split(':')[0],
      minutes: data.arrival_time.split(':')[1],
      seconds: '00'
    },
    leave_time: {
      hours: data.leave_time.split(':')[0],
      minutes: data.leave_time.split(':')[1],
      seconds: '00'
    },
    name: data.name,
    trip_date: data.trip_date
  }
  emit('editDayDetination', computedData)
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
    <!-- date selector -->
    <div>
      <select
        class="border border-[var(--secondary-brand-color-1)] w-full text-[var(--dark-color-1) tracking-wider rounded-lg focus:outline-0 focus:ring-0 focus:border-[var(--secondary-brand-color-1)]"
        @change="getDayTripDestination"
      >
        <option
          v-for="dayItem in tripsStore.getTripDaysSelectOptions"
          :key="dayItem.date"
          :value="dayItem.date"
        >
          {{ dayItem.date }}（{{ dayItem.weekday }}）
        </option>
      </select>
    </div>
    <!-- 目的地排程 -->
    <div class="mt-[8px]">
      <!-- destination item -->
      <div
        v-for="item in tripsStore.getDayDestinationsData"
        :key="item.id"
        class="group cursor-pointer"
        :class="{ active: item.id === tripsStore.currentDestinationId }"
        @click="$emit('clickDestinationHandler', { id: item.id, place_id: item.place_id })"
      >
        <!-- main item（destination info） -->
        <div
          class="flex items-center border-y border-[var(--gray-color-2)] py-[14px] px-[2px] group-[.active]:bg-[var(--main-brand-color-1)]"
        >
          <!-- grab icon -->
          <div class="mr-[10px]">
            <img class="w-[12px]" src="@/assets/images/icon/grab_icon.svg" />
          </div>
          <!-- time & info -->
          <div class="flex flex-col grow gap-[8px]">
            <span class="text-[var(--main-brand-color-1)] group-[.active]:text-white"
              >{{ item.arrival_time }} ~ {{ item.leave_time }}</span
            >
            <span class="text-black group-[.active]:text-white">{{ item.name }}</span>
          </div>
          <!-- actions -->
          <div class="flex items-center gap-[6px]">
            <!-- edit -->
            <button @click="editDayDetination(item)">
              <img class="w-[24px]" src="@/assets/images/icon/edit_icon.svg" />
            </button>
            <!-- delete -->
            <button>
              <img class="w-[24px]" src="@/assets/images/icon/cancel_bold_icon.svg" />
            </button>
          </div>
        </div>
        <!-- sub item（destination distance） -->
        <div v-if="item.leg" class="flex items-center px-[16px] py-[8px]">
          <!-- icon -->
          <div class="w-[8px]"><img src="@/assets/images/icon/distance_line_icon.svg" /></div>
          <!-- distance & travel time -->
          <div class="flex flex-col ml-[14px] text-[var(--main-brand-color-2)]">
            <span>車程： {{ item.leg?.distance?.text }}</span>
            <span>預計時間：{{ item.leg?.duration?.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
