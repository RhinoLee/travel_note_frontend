<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'
import SearchBar from '@/components/Header/SearchBar.vue'
import BurgerMenu from '@/components/Header/BurgerMenu.vue'
import BurgerDropdownMenu from '@/components/Header/BurgerDropdownMenu.vue'
import UserDropdownMenu from '@/components/Header/UserDropdownMenu.vue'
import useUserStore from '@/stores/user/user'
import DefaultAvatar from '@/assets/images/icon/default_avatar_icon.svg'

const burgerDropdownMenuRef = ref<InstanceType<typeof BurgerDropdownMenu> | null>(null)
const userDropdownMenuRef = ref<InstanceType<typeof UserDropdownMenu> | null>(null)

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

function closeAllDropdown() {
  userDropdownMenuRef.value?.setDropdownVisable(null, false)
  burgerDropdownMenuRef.value?.setDropdownVisable(null, false)
}

const route = useRoute()

watch(
  () => route.name,
  () => closeAllDropdown()
)
</script>

<template>
  <header class="relative border-b border-[var(--secondary-brand-color-1)] h-[54px] bg-white z-50">
    <div class="relative w-full h-full bg-white z-40">
      <div class="flex items-center py-[14px] px-[24px] w-full h-full">
        <!-- buger menu -->
        <BurgerMenu @click.stop="burgerDropdownMenuRef?.setDropdownVisable"></BurgerMenu>
        <!-- logo -->
        <div class="w-[94px] mx-auto md:mx-0 md:w-[200px]">
          <router-link :to="{ name: 'home' }" v-slot="{ href, navigate }" custom>
            <div class="w-[94px] md:w-[108px] cursor-pointer">
              <a :href="href" @click="navigate">
                <img class="w-full" src="@/assets/images/icon/black_logo_icon.svg" alt="旅行筆記" />
              </a>
            </div>
          </router-link>
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
          <div>
            <img
              v-default-image="DefaultAvatar"
              :src="userStore.userInfo?.avatar"
              class="w-[24px] h-[24px] object-cover object-center rounded-full overflow-hidden"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <!-- burger dropdown-menu -->
    <BurgerDropdownMenu ref="burgerDropdownMenuRef"></BurgerDropdownMenu>
    <UserDropdownMenu ref="userDropdownMenuRef"></UserDropdownMenu>
  </header>
</template>

<style lang="less" scoped></style>
