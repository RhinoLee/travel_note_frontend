<script setup lang="ts">
import { ref } from 'vue'

const scheduleList = ref([
  {
    id: 1,
    title: '台北一日遊',
    start_date: '2021-10-10',
    end_date: '2021-10-10',
    pic: 'https://picsum.photos/280/120'
  },
  {
    id: 2,
    title: '台北一日遊',
    start_date: '2021-10-10',
    end_date: '2021-10-10',
    pic: 'https://picsum.photos/280/120'
  },
  {
    id: 3,
    title: '台北一日遊',
    start_date: '2021-10-10',
    end_date: '2021-10-10',
    pic: 'https://picsum.photos/280/120'
  },
  {
    id: 4,
    title: '台北一日遊',
    start_date: '2021-10-10',
    end_date: '2021-10-10',
    pic: 'https://picsum.photos/280/120'
  },
  {
    id: 5,
    title: '台北一日遊',
    start_date: '2021-10-10',
    end_date: '2021-10-10',
    pic: 'https://picsum.photos/280/120'
  },
  {
    id: 6,
    title: '台北一日遊',
    start_date: '2021-10-10',
    end_date: '2021-10-10',
    pic: 'https://picsum.photos/280/120'
  },
  {
    id: 7,
    title: '台北一日遊',
    start_date: '2021-10-10',
    end_date: '2021-10-10',
    pic: 'https://picsum.photos/280/120'
  },
  {
    id: 8,
    title: '台北一日遊',
    start_date: '2021-10-10',
    end_date: '2021-10-10',
    pic: 'https://picsum.photos/280/120'
  }
])
</script>

<template>
  <div
    class="grid grid-cols-1 gap-y-[12px] md:grid-cols-2 md:gap-x-[20px] lg:grid-cols-3 xl:grid-cols-4"
  >
    <!-- schedule item -->
    <div
      v-for="schedule in scheduleList"
      :key="schedule.id"
      class="flex flex-col bg-white shadow-green rounded-md overflow-hidden"
    >
      <!-- schedule pic -->
      <div><img :src="schedule.pic" class="w-full" /></div>
      <div class="px-[24px] py-[12px] md:py-[20px]">
        <!-- schedule title -->
        <h3 class="text-[var(--dark-color-1)] text-base tracking-wide">{{ schedule.title }}</h3>
        <!-- schedule date -->
        <div class="mt-[12px] text-[var(--main-brand-color-1)] text-xs tracking-wide">
          <span>{{ schedule.start_date }}</span>
          <span>~</span>
          <span>{{ schedule.end_date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
