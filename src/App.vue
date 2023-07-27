<script setup lang="ts">
import { RouterView } from 'vue-router'
import Modal from './components/common/Modal.vue'
</script>

<template>
  <Notifications />
  <Modal />
  <RouterView />
</template>

<style scoped></style>
