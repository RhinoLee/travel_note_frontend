<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import SchedulePanel from './components/schedulePanel/SchedulePanel.vue'
import DestinationPanel from './components/schedulePanel/DestinationPanel.vue'
import { useGoogleMapsLoader } from '@/composables/map/useGoogleMapsLoader'
import { useGooglePlacesService } from '@/composables/map/useGooglePlacesService'
import useMapStore from '@/stores/map/map'
import useTripsStore from '@/stores/trips/trips'
import FormModal from '@/components/common/formModal/FormModal.vue'
import useFormModal from '@/composables/modal/useFormModal'
import { schema, formFieldsHandler } from './config/formFields'
import { formatDateToUTC } from '@/utils/formatDateTime'

import type { Ref } from 'vue'
import type { IFormField } from '@/components/common/formModal/config/types'

const tripsStore = useTripsStore()
const customFormFields: Ref<IFormField[]> = ref([])

interface GooglePlacesService {
  nearbySearchHandler: (request: google.maps.places.TextSearchRequest) => void
  getPlaceDetails: (placeId: string) => void
}

const mapStore = useMapStore()
const mapDom = ref<HTMLDivElement | undefined>(undefined)
const googlePlacesService = ref<GooglePlacesService | null>(null)

const { formMadalRef, createClickHandler } = useFormModal()

// call 新增目的地 api
async function createSubmitHandler(data: any) {
  tripsStore.setTripDayData(data)
  await tripsStore.createTripDayAction()
}
function updateSubmitHandler() {}

// 按下加入行程，打開 Form 讓 user 填資料
function openDestinationFormHandler() {
  // 帶入透過 place_id 取得的 place detail name 給 name field 做 initValue 設定
  const field = customFormFields.value.find((field) => field.prop === 'name')
  if (field) field.initValue = mapStore.getClickedPlaceDetail?.name
  // 打開新增 destination 表單
  createClickHandler()
}

const route = useRoute()
const { tripId, tripDate } = route.params

// 取得日期對應到的目的地行程
async function getDayTripDestination(date: Date | string) {
  // call api to get this day destination
  await tripsStore.getDayDestinationAction(formatDateToUTC(date))
}

onMounted(async () => {
  await useGoogleMapsLoader(mapDom)

  if (mapStore.getMap) {
    googlePlacesService.value = useGooglePlacesService(mapStore.getMap)
  } else {
    // 掛載失敗錯處理
  }

  try {
    await tripsStore.getTripAction(tripId as string)

    // 取得 trip 資訊，把相關資訊給 formFields 做 date, years range 設定
    customFormFields.value = formFieldsHandler({
      start_date: tripsStore.currentTrip?.start_date,
      end_date: tripsStore.currentTrip?.end_date
    })

    // 取得 start_date 的行程
    await getDayTripDestination(tripDate as string)
  } catch (err) {
    console.log('getTrip api error', err)
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
      <SchedulePanel v-if="mapStore.getMap" @getDayTripDestination="getDayTripDestination">
        <DestinationPanel @addDestinationBtnClick="openDestinationFormHandler"></DestinationPanel>
      </SchedulePanel>
    </div>
    <!-- map -->
    <div class="w-full h-full">
      <div class="w-full h-full" ref="mapDom"></div>
    </div>
  </div>

  <FormModal
    ref="formMadalRef"
    modalTitle="新增目的地"
    :formFields="customFormFields"
    :schema="schema"
    @createSubmit="createSubmitHandler"
    @updateSubmit="updateSubmitHandler"
  >
  </FormModal>
</template>

<style lang="less" scoped></style>
