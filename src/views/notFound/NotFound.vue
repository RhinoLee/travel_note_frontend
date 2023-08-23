<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="w-full h-full">
    <div
      class="relative w-full h-full bg-[url('@/assets/images/img_loginbg.webp')] bg-no-repeat bg-cover bg-center"
    >
      <!-- logo -->
      <div class="flex pt-[30px]">
        <router-link :to="{ name: 'home' }">
          <img
            src="@/assets/images/icon/white_logo_icon.svg"
            alt="旅行筆記 | Travel Note"
            class="ml-[15px] w-[110px] h-auto lg:w-[156px] lg:ml-[30px]"
          />
        </router-link>
      </div>
      <!-- message -->
      <div class="flex flex-col justify-center items-center mt-[44px] text-white">
        <h2 class="text-[36px]">404</h2>
        <span class="mt-[24px] text-[18px]">您的旅途似乎迷路了</span>
        <router-link :to="{ name: 'home' }" class="mt-[32px]">
          <span>請點擊這邊，幫您導航回首頁～</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
