<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useTripsStore from '@/stores/trips/trips'
import Pagination from '@/components/common/Pagination.vue'
import { usePagination } from '@/composables/pagination/usePagination'
import type { IListItem } from '@/services/trips/type'

const tripsStore = useTripsStore()
const { currentPage, totalSize, totalPages, limit, setPageParams, goToPage, nextPage, prevPage } =
  usePagination(tripsStore.getTripsAction)

async function getTripsHandler() {
  const data = await tripsStore.getTripsAction({ page: currentPage.value, limit: limit.value })
  setPageParams(data.pagination)
}

const router = useRouter()
function goToTrip(trip: IListItem) {
  tripsStore.setCurrentTrip(trip)
  router.push({ name: 'trip', params: { tripId: trip.id, tripDate: trip.start_date } })
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
      <div>
        <img
          v-default-image="null"
          :src="trip.imageUrl"
          class="w-full h-[200px] object-cover object-center"
        />
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
</template>
