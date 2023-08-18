<script setup lang="ts">
import { reactive } from 'vue'
import useUserStore from '@/stores/user/user'
import type { ILoginParams } from '@/services/user/type'

const loginData: ILoginParams = reactive({
  email: '',
  password: ''
})

const userStore = useUserStore()

async function loginHandler() {
  const res = await userStore.loginAction(loginData)
}

async function getGoogleLoginUrl() {
  const res = await userStore.getGoogleLoginUrlAction()
}
</script>

<template>
  <div class="max-w-[364px] flex flex-col items-center mx-auto">
    <!-- form-item -->
    <div class="py-[10px] w-full">
      <label class="block">
        <span class="block text-base text-[var(--main-brand-color-1)] tracking-wider">信箱</span>
        <input
          type="text"
          v-model.trim="loginData.email"
          class="block border-[var(--gray-color-1)] mt-1 px-3 py-2 w-full h-[56px] rounded-md focus:border-[var(--main-brand-color-1)] focus:ring-[var(--main-brand-color-1)]"
        />
      </label>
    </div>
    <!-- form-item -->
    <div class="py-[10px] w-full">
      <label class="block">
        <span class="block text-base text-[var(--main-brand-color-1)] tracking-wider">密碼</span>
        <input
          type="text"
          v-model.trim="loginData.password"
          class="block border-[var(--gray-color-1)] mt-1 px-3 py-2 w-full h-[56px] rounded-md focus:border-[var(--main-brand-color-1)] focus:ring-[var(--main-brand-color-1)]"
        />
      </label>
    </div>
    <!-- button -->
    <div class="flex items-center justify-center">
      <button
        @click="loginHandler"
        class="mt-[25px] w-[144px] h-[40px] text-white text-base bg-[var(--main-brand-color-1)] shadow-custom rounded-md tracking-widest"
      >
        登入
      </button>
      <button
        @click="getGoogleLoginUrl"
        class="ml-[20px] mt-[25px] w-[144px] h-[40px] text-white text-base bg-[var(--main-brand-color-1)] shadow-custom rounded-md tracking-widest"
      >
        google 登入
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
