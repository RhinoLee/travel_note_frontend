<script setup lang="ts">
import useGlobalStore from '@/stores/global/global'
const globalStore = useGlobalStore()
</script>

<template>
  <div v-if="globalStore.isPageLoading" class="fixed top-0 left-0 w-full h-full bg-black/40 z-50">
    <div class="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
      <img
        class="w-[420px] animate-blink"
        src="@/assets/images/icon/logo_opacity_icon.svg"
        alt=""
      />
    </div>
  </div>
</template>

<style lang="less" scoped></style>
