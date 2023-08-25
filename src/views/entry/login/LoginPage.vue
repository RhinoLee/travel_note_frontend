<script setup lang="ts">
import LoginForm from './components/LoginForm.vue'
import useUserStore from '@/stores/user/user'

const userStore = useUserStore()

async function getGoogleLoginUrl() {
  const res = await userStore.getGoogleLoginUrlAction()
}
</script>

<template>
  <div class="mx-auto max-w-[364px]">
    <LoginForm></LoginForm>
    <!-- other login -->
    <div class="flex justify-center items-center gap-[8px] mt-[20px]">
      <div class="grow h-[1px] bg-[var(--gray-color-1)]"></div>
      <span class="text-[var(--gray-color-1)] text-center">或使用其他登入</span>
      <div class="grow h-[1px] bg-[var(--gray-color-1)]"></div>
    </div>
    <!-- other login buttons -->
    <div class="mt-[20px]">
      <button
        @click="getGoogleLoginUrl"
        class="flex justify-center items-center gap-[12px] border border-[var(--main-brand-color-1)] w-full h-[48px] text-black bg-white rounded-md tracking-widest"
      >
        <img src="@/assets/images/icon/google_login_icon.svg" alt="" />
        <span>Google 登入</span>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
