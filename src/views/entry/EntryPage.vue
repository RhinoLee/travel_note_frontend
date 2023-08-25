<template>
  <div class="w-full h-full grid lg:grid-cols-2">
    <!-- banner section -->
    <div
      class="relative h-[200px] bg-[url('@/assets/images/img_loginbg.webp')] bg-no-repeat bg-cover bg-center md:h-[250px] lg:h-full"
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
      <div
        class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[250px] md:max-h-[350px]"
      >
        <img src="@/assets/images/icon/logo_opacity_icon.svg" class="w-[148px] lg:w-[297px]" />
      </div>
    </div>
    <!-- login form section -->
    <div class="bg-white pb-[30px]">
      <div class="flex flex-col items-center px-[24px] pt-0 h-full lg:pt-[12%]">
        <!-- logo -->
        <div class="hidden lg:block">
          <img src="@/assets/images/icon/big_logo_icon.svg" class="w-[80px] h-auto" />
        </div>
        <!-- login or register nav -->
        <nav class="mt-[24px] mb-[18px] lg:mt-[44px] lg:mb-[36px]">
          <ul
            v-if="!isRedirectRoute"
            class="flex justify-center items-center gap-[52px] text-3xl text-[--gray-color-1]"
          >
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
import { computed } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isRedirectRoute = computed(() => {
  return route.name === 'googleRedirectUrl'
})

function changeRoute(routesName: string) {
  router.push({ name: routesName })
}
</script>

<style scoped></style>
