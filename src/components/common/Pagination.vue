<script setup lang="ts">
import { computed } from 'vue'
import PageArrow from '@/components/icons/PageArrow.vue'

interface IProps {
  totalSize: number
  totalPages: number
  limit: number
  currentPage: number
}

const emit = defineEmits(['changePage', 'prevPage', 'nextPage'])
const props = defineProps<IProps>()

// 中間頁數顯示
const showSurroundRange = 2
const surroundingPages = computed(() => {
  // currentPage 的前兩頁 & 後兩頁要顯示
  const start = Math.max(2, props.currentPage - showSurroundRange) // 比 2 小取 2
  const end = Math.min(props.totalPages - 1, props.currentPage + showSurroundRange)

  return Array.from({ length: end - start + 1 }, (_, i) => i + start)
})

// 前方站位符顯示
const isShowFrontDots = computed(() => {
  return props.currentPage - showSurroundRange > 2
})

// 後方站位符顯示
const isShowBackDots = computed(() => {
  return props.currentPage + showSurroundRange < props.totalPages - 1
})

function changePage(page: number) {
  emit('changePage', page)
}
</script>

<template>
  <div v-if="totalPages" class="flex items-center justify-center mt-[40px]">
    <!-- prev -->
    <button @click="$emit('prevPage')" class="mr-[20px]">
      <PageArrow></PageArrow>
    </button>
    <!-- 第一頁固定 -->
    <button
      v-if="totalPages >= 1"
      @click="changePage(1)"
      class="flex items-center justify-center h-[36px] w-[36px] rounded-md"
      :class="{ 'bg-[var(--main-brand-color-1)] text-white': currentPage === 1 }"
    >
      <div>1</div>
    </button>
    <!-- 站位符 -->
    <div
      v-show="isShowFrontDots"
      class="flex items-center justify-center h-[36px] w-[36px] rounded-md"
    >
      <span>...</span>
    </div>
    <!-- pages -->
    <div class="flex items-center gap-[6px]">
      <!-- page item -->
      <button
        v-for="page in surroundingPages"
        @click="changePage(page)"
        class="flex items-center justify-center h-[36px] w-[36px] rounded-md"
        :class="{ 'bg-[var(--main-brand-color-1)] text-white': page === currentPage }"
        :key="page"
      >
        <div>{{ page }}</div>
      </button>
    </div>
    <!-- 站位符 -->
    <div
      v-show="isShowBackDots"
      class="flex items-center justify-center h-[36px] w-[36px] rounded-md"
    >
      <span>...</span>
    </div>
    <!-- 最後一頁固定 -->
    <button
      v-if="totalPages > 1"
      @click="changePage(totalPages)"
      class="flex items-center justify-center h-[36px] w-[36px] rounded-md"
      :class="{ 'bg-[var(--main-brand-color-1)] text-white': currentPage === totalPages }"
    >
      <div>{{ totalPages }}</div>
    </button>
    <!-- next -->
    <button @click="$emit('nextPage')" class="ml-[20px]">
      <PageArrow :angle="180"></PageArrow>
    </button>
  </div>
</template>

<style lang="less" scoped></style>
