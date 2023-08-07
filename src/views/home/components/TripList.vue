<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useTripsStore from '@/stores/trips/trips'
import Pagination from '@/components/common/Pagination.vue'
import { usePagination } from '@/composables/pagination/usePagination'

const tripsStore = useTripsStore()
const { currentPage, totalSize, totalPages, limit, setPageParams, goToPage, nextPage, prevPage } =
  usePagination(tripsStore.getTripsAction)

async function getTripsHandler() {
  const data = await tripsStore.getTripsAction({ page: currentPage.value, limit: limit.value })
  setPageParams(data.pagination)
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
      v-for="schedule in tripsStore.trips"
      :key="schedule.id"
      class="flex flex-col bg-white shadow-green rounded-md overflow-hidden"
    >
      <!-- schedule pic -->
      <div>
        <img
          v-default-image="null"
          :src="schedule.imageUrl"
          class="w-full h-[200px] object-cover object-center"
        />
      </div>
      <div class="px-[24px] py-[12px] md:py-[20px]">
        <!-- schedule title -->
        <h3 class="text-[var(--dark-color-1)] text-base tracking-wide">{{ schedule.name }}</h3>
        <!-- schedule date -->
        <div class="mt-[12px] text-[var(--main-brand-color-1)] text-xs tracking-wide">
          <span>{{ schedule.startDate }}</span>
          <span>~</span>
          <span>{{ schedule.endDate }}</span>
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
