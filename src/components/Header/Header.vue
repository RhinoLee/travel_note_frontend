<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import SearchBar from '@/components/Header/SearchBar.vue'
import BurgerMenu from '@/components/Header/BurgerMenu.vue'
import BurgerDropdownMenu from '@/components/Header/BurgerDropdownMenu.vue'
import UserDropdownMenu from '@/components/Header/UserDropdownMenu.vue'
import useUserStore from '@/stores/user/user'

const burgetDropdownMenuRef = ref<InstanceType<typeof BurgerDropdownMenu> | null>(null)
const userDropdownMenuRef = ref<InstanceType<typeof UserDropdownMenu> | null>(null)

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
console.log('userInfo', userInfo)
</script>

<template>
  <header class="relative border-b border-[var(--secondary-brand-color-1)] h-[54px] bg-white z-50">
    <div class="relative w-full h-full bg-white z-40">
      <div class="flex items-center py-[14px] px-[24px] w-full h-full">
        <!-- buger menu -->
        <BurgerMenu @click.stop="burgetDropdownMenuRef?.setDropdownVisable"></BurgerMenu>
        <!-- logo -->
        <div class="w-[94px] mx-auto md:mx-0 md:w-[200px]">
          <img
            class="w-[94px] md:w-[108px]"
            src="@/assets/images/icon/black_logo_icon.svg"
            alt="旅行筆記"
          />
        </div>
        <!-- search -->
        <div class="hidden md:block md:grow">
          <SearchBar></SearchBar>
        </div>
        <!-- user info -->
        <div
          @click.stop="userDropdownMenuRef?.setDropdownVisable"
          class="flex items-center w-[24px] md:ml-auto md:pl-[24px] md:w-auto cursor-pointer"
        >
          <div v-if="userInfo?.name" class="hidden mr-[14px] md:block">{{ userInfo?.name }}</div>
          <div class="">
            <img class="w-[24px]" src="@/assets/images/icon/default_avatar_icon.svg" />
          </div>
        </div>
      </div>
    </div>
    <!-- burger dropdown-menu -->
    <BurgerDropdownMenu ref="burgetDropdownMenuRef"></BurgerDropdownMenu>
    <UserDropdownMenu ref="userDropdownMenuRef"></UserDropdownMenu>
  </header>
</template>

<style lang="less" scoped></style>
