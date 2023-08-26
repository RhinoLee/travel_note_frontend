<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useTripsStore from '@/stores/trips/trips'
import useModal from '@/composables/modal/useModal'
import Pagination from '@/components/common/Pagination.vue'
import Modal from '@/components/common/Modal.vue'
import { usePagination } from '@/composables/pagination/usePagination'

import type { IListItem } from '@/services/trips/type'

const tripsStore = useTripsStore()
const { currentPage, totalSize, totalPages, limit, setPageParams, goToPage, nextPage, prevPage } =
  usePagination(tripsStore.getTripsAction)

async function getTripsHandler(page?: number | undefined) {
  const data = await tripsStore.getTripsAction({
    page: page ?? currentPage.value,
    limit: limit.value
  })
  setPageParams(data.pagination)
}

const router = useRouter()
function goToTrip(trip: IListItem) {
  tripsStore.setCurrentTrip(trip)
  router.push({ name: 'trip', params: { trip_id: trip.id, tripDate: trip.start_date } })
}

const { modalRef, openModal, executeConfirmAction } = useModal()
function deleteTripHandler(tripId: number) {
  const modalMessage = '確定要刪除這趟旅程？'
  openModal(modalMessage, tripId, tripsStore.deleteTripAction)
}

async function clickConfirm() {
  // call api
  await executeConfirmAction()
  // update list
  await getTripsHandler(1)
}

onMounted(async () => {
  try {
    await getTripsHandler()
  } catch (err) {
    console.log(err)
  }
})

defineExpose({ getTripsHandler })
</script>

<template>
  <div
    v-if="tripsStore.trips"
    class="grid grid-cols-1 gap-y-[12px] md:grid-cols-2 md:gap-x-[20px] lg:grid-cols-3 xl:grid-cols-4"
  >
    <!-- schedule item -->
    <div
      v-for="trip in tripsStore.getTrips"
      :key="trip.id"
      class="flex flex-col bg-white shadow-green rounded-md overflow-hidden cursor-pointer"
      @click="goToTrip(trip)"
    >
      <!-- trip pic -->
      <div class="relative">
        <img
          v-default-image="null"
          :src="trip.imageUrl"
          class="w-full h-[200px] object-cover object-center"
        />
        <!-- delete icon -->
        <div
          @click.stop="deleteTripHandler(trip.id)"
          class="absolute top-[12px] right-[12px] flex items-center justify-center w-[26px] h-[26px] bg-[var(--green-color-1)] rounded-full overflow-hidden cursor-pointer"
        >
          <img class="w-[18px]" src="@/assets/images/icon/delete_icon.svg" />
        </div>
      </div>
      <div class="px-[24px] py-[12px] md:py-[20px]">
        <!-- trip title -->
        <h3 class="text-[var(--dark-color-1)] text-base tracking-wide">{{ trip.name }}</h3>
        <!-- trip date -->
        <div class="mt-[12px] text-[var(--main-brand-color-1)] text-xs tracking-wide">
          <span>{{ trip.start_date }}</span>
          <span>~</span>
          <span>{{ trip.end_date }}</span>
        </div>
      </div>
    </div>
  </div>

  <Pagination
    :totalSize="totalSize"
    :totalPages="totalPages"
    :limit="limit"
    :currentPage="currentPage"
    @changePage="goToPage"
    @prevPage="prevPage"
    @nextPage="nextPage"
  ></Pagination>

  <Modal ref="modalRef" @clickConfirm="clickConfirm"></Modal>
</template>
