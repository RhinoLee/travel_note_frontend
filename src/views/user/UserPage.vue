<script setup lang="ts">
import useUserStore from '@/stores/user/user'
import DefaultAvatar from '@/assets/images/icon/default_avatar_icon.svg'
const userStore = useUserStore()
</script>

<template>
  <div class="w-full h-full grid grid-cols-1 lg:grid-cols-2">
    <!-- banner section -->
    <div
      class="relative bg-[url('@/assets/images/img_loginbg.webp')] bg-no-repeat bg-cover bg-center"
    >
      <!-- opacity-logo-bg -->
      <div
        class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[250px] md:max-h-[350px]"
      >
        <img src="@/assets/images/icon/logo_opacity_icon.svg" class="w-[148px] lg:w-[297px]" />
      </div>
    </div>
    <!-- login form section -->
    <div class="bg-white pt-[44px] lg:pt-0 lg:pb-[30px] lg:pl-[20%]">
      <div class="flex flex-col px-[24px] pt-0 h-full lg:pt-[18%]">
        <h2
          class="mb-[28px] text-[26px] text-[var(--main-brand-color-1)] tracking-widest md:text-[32px] lg:mb-[54px]"
        >
          個人賬戶
        </h2>
        <!-- avatar -->
        <div class="mb-[28px] lg:mb-[54px]">
          <div>
            <img
              v-default-image="DefaultAvatar"
              :src="userStore.userInfo?.avatar"
              class="w-[88px] rounded-full overflow-hidden"
              alt=""
            />
          </div>
        </div>
        <!-- email & name -->
        <div class="flex flex-col gap-[12px] text-[var(--dark-color-1)] tracking-widest">
          <div class="flex flex-col md:flex-row md:items-center">
            <span class="min-w-[74px] text-[var(--main-brand-color-1)] font-extrabold"
              >用戶名稱</span
            >
            <span class="break-word md:ml-[16px]">{{ userStore.userInfo.name }}</span>
          </div>
          <div class="flex flex-col md:flex-row md:items-center">
            <span class="min-w-[74px] text-[var(--main-brand-color-1)] font-extrabold"
              >聯絡信箱</span
            >
            <span class="break-word md:ml-[16px]">{{ userStore.userInfo.email }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
