<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import type { IDayDestinationRes } from '@/services/trips/type'

const tripsStore = useTripsStore()
const customFormFields: Ref<IFormField[]> = ref([])

interface GooglePlacesService {
  nearbySearchHandler: (request: google.maps.places.TextSearchRequest) => void
  getPlaceDetails: (placeId: string) => void
  createMarkerByDestination: (places: IDayDestinationRes[]) => void
  toggleBounce: (marker: google.maps.Marker) => void
  triggerMarkerHandler: ({
    marker,
    place_id,
    destinationId
  }: {
    marker: google.maps.Marker
    place_id: string
    destinationId: number | null
  }) => void
  calculateAndDisplayRoute: () => void
}

const mapStore = useMapStore()
const mapDom = ref<HTMLDivElement | undefined>(undefined)
const googlePlacesService = ref<GooglePlacesService | null>(null)
const currentRouteDate = ref('')
const router = useRouter()
const route = useRoute()
const { trip_id, tripDate } = route.params
currentRouteDate.value = tripDate as string
const { formMadalRef, createClickHandler, editClickHandler } = useFormModal()
const schedulePanelRef = ref<InstanceType<typeof SchedulePanel> | null>(null)

// call 新增目的地 api
async function createSubmitHandler(data: any) {
  tripsStore.setTripDayData(data)
  const result = await tripsStore.createTripDayAction()
  if (result.success) formMadalRef.value?.setModalVisible()
}
async function updateSubmitHandler(data: any) {
  tripsStore.setEditDayDestination(data)
  const result = await tripsStore.updateTripDayWithDestinationAction()
  // 關閉表單
  if (result.success) formMadalRef.value?.setModalVisible()
  // 重新取得當前日期的行程
  await getDayTripDestination(currentRouteDate.value)
}

// 按下加入行程，打開 Form 讓 user 填資料
function openDestinationFormHandler(type: string = 'create', data?: any) {
  if (type === 'create') {
    // 帶入透過 place_id 取得的 place detail name 給 name field 做 initValue 設定
    const field = customFormFields.value.find((field) => field.prop === 'name')
    if (field) field.initValue = mapStore.getClickedPlaceDetail?.name
    // 打開新增 destination 表單
    createClickHandler()
  } else if (type === 'edit') {
    editClickHandler(data)
  }
}

// 取得日期對應到的目的地行程
async function getDayTripDestination(date: string) {
  currentRouteDate.value = date
  // 清除當前顯示的 path
  mapStore.displayDirectionPath(null)
  // 設定 route
  router.push({ name: 'trip', params: { tripDate: date as string } })
  // call api to get this day destination
  await tripsStore.getDayDestinationAction(formatDateToUTC(date))
}

function clickDestinationHandler({ id, place_id }: { id: number; place_id: string }) {
  tripsStore.setCurrentDestinationId(id)
  const marker = mapStore.destinationMarkers.filter((marker) => {
    return marker.getTitle() === String(id)
  })

  googlePlacesService.value?.triggerMarkerHandler({
    marker: marker[0],
    place_id,
    destinationId: id
  })

  // 手機版：關閉 schedule panel
  schedulePanelRef.value?.setVisable()
}

onMounted(async () => {
  await useGoogleMapsLoader(mapDom)

  if (mapStore.getMap) {
    googlePlacesService.value = useGooglePlacesService(mapStore.getMap)
  } else {
    // 掛載失敗錯處理
  }

  try {
    await tripsStore.getTripAction(trip_id as string)

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
  () => tripsStore.dayDestinationsData,
  async (newVal) => {
    await googlePlacesService.value?.createMarkerByDestination(newVal)
    googlePlacesService.value?.calculateAndDisplayRoute()
  }
)

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
  <div class="lg:grid lg:grid-cols-[400px_1fr] w-full h-full">
    <!-- panel -->
    <div class="absolute top-[53px] left-0 h-full z-10 lg:relative lg:top-0 lg:w-full">
      <SchedulePanel
        ref="schedulePanelRef"
        v-if="mapStore.getMap"
        :currentRouteDate="currentRouteDate"
        @getDayTripDestination="getDayTripDestination"
        @editDayDetination="(data) => openDestinationFormHandler('edit', data)"
        @clickDestinationHandler="clickDestinationHandler"
      >
      </SchedulePanel>
      <DestinationPanel @addDestinationBtnClick="openDestinationFormHandler"></DestinationPanel>
    </div>
    <!-- map -->
    <div class="w-full h-full">
      <div class="w-full h-full" ref="mapDom"></div>
    </div>
    <!-- panel trigger -->
    <div class="absolute left-0 top-[150px] z-40 lg:hidden">
      <button
        @click="schedulePanelRef?.setVisable()"
        class="border-y border-r py-[8px] px-[4px] text-[var(--gray-color-2)] bg-[var(--secondary-brand-color-1)] [writing-mode:vertical-rl] tracking-[4px] rounded-r-md"
      >
        行程選單
      </button>
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
