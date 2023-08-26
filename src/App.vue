<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Header from '@/components/Header/Header.vue'

const route = useRoute()

// 不要有 header 的 router name
const noRenderHeaderList = ['login', 'register', 'notFound']
const showHeader = computed(() => {
  if (!route.name) return false
  return !noRenderHeaderList.includes(route.name as any)
})
</script>

<template>
  <Notifications />
  <Header v-if="showHeader"></Header>
  <div :class="{ 'pt-[53px]': showHeader }" class="w-full h-full">
    <RouterView />
  </div>
</template>

<style scoped></style>
