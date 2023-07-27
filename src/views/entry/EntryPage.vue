<template>
  <div class="w-full h-full grid grid-cols-1 lg:grid-cols-2">
    <!-- banner section -->
    <div
      class="relative min-h-[350px] bg-[url('@/assets/images/img_loginbg.webp')] bg-no-repeat bg-cover bg-center"
    >
      <!-- logo -->
      <div>
        <img
          src="@/assets/images/icon/white_logo_icon.svg"
          alt="旅行筆記 | Travel Note"
          class="block ml-auto mr-auto mt-[30px] w-[110px] h-auto lg:w-[156px] lg:ml-[30px]"
        />
      </div>
      <!-- opacity-logo-bg -->
      <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <img src="@/assets/images/icon/logo_opacity_icon.svg" class="w-[148px] lg:w-[297px]" />
      </div>
    </div>
    <!-- login form section -->
    <div class="bg-white pb-[30px]">
      <div class="flex flex-col items-center px-[24px] pt-0 h-full lg:pt-[18%]">
        <!-- logo -->
        <div class="hidden lg:block">
          <img src="@/assets/images/icon/big_logo_icon.svg" class="w-[80px] h-auto" />
        </div>
        <!-- login or register nav -->
        <nav class="mt-[44px] mb-[36px]">
          <ul class="flex justify-center items-center gap-[52px] text-3xl text-[--gray-color-1]">
            <li
              @click="changeRoute('login')"
              class="cursor-pointer"
              :class="{
                'active-text': $route.name === 'login',
                'active-underline': $route.name === 'login'
              }"
            >
              登入
            </li>
            <li
              @click="changeRoute('register')"
              class="cursor-pointer"
              :class="{
                'active-text': $route.name === 'register',
                'active-underline': $route.name === 'register'
              }"
            >
              註冊
            </li>
          </ul>
        </nav>
        <!-- form -->
        <div class="w-full">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()

function changeRoute(routesName: string) {
  router.push({ name: routesName })
}
</script>

<style scoped></style>
