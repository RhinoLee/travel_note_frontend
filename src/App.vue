<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute, onBeforeRouteUpdate } from 'vue-router'
import Modal from '@/components/common/Modal.vue'
import Header from '@/components/Header/Header.vue'

const route = useRoute()

// 不要有 header 的 router name
const noRenderHeaderList = ['login']
const showHeader = computed(() => {
  if (!route.name) return false
  return !noRenderHeaderList.includes(route.name as any)
})
</script>

<template>
  <Notifications />
  <Modal />
  <Header v-if="showHeader"></Header>
  <RouterView />
</template>

<style scoped></style>
