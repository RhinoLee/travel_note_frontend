<script setup lang="ts">
import { reactive } from 'vue'
import useUserStore from '@/stores/user/user'
import { loginSchema } from '@/composables/validation/schema/rules'
import { useValidation } from '@/composables/validation/useValidation'
import type { ILoginParams } from '@/services/user/type'
import { notify } from '@kyvg/vue3-notification'
import { LOGIN_FAILED_MESSAGE } from '@/common/constants'

const loginData: ILoginParams = reactive({
  email: '',
  password: ''
})

const userStore = useUserStore()

const { validate, state } = useValidation(loginSchema)

async function loginHandler() {
  const isValid = await validate(loginData)

  if (isValid) {
    try {
      await userStore.loginAction(loginData)
    } catch (err) {
      notify({ type: 'error', text: LOGIN_FAILED_MESSAGE })
    }
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-[20px] w-full">
    <!-- form-item -->
    <div class="w-full">
      <label class="block">
        <span class="block text-base text-[var(--main-brand-color-1)] tracking-wider">信箱</span>
        <input
          type="email"
          v-model.trim="loginData.email"
          @input="validate(loginData)"
          class="block border-[var(--gray-color-1)] mt-1 px-3 py-2 w-full h-[56px] rounded-md focus:border-[var(--main-brand-color-1)] focus:ring-[var(--main-brand-color-1)]"
        />
      </label>
      <span v-if="state.errors?.email" class="text-red-500">{{ state.errors.email }}</span>
    </div>
    <!-- form-item -->
    <div class="w-full">
      <label class="block">
        <span class="block text-base text-[var(--main-brand-color-1)] tracking-wider">密碼</span>
        <input
          type="password"
          v-model.trim="loginData.password"
          @input="validate(loginData)"
          class="block border-[var(--gray-color-1)] mt-1 px-3 py-2 w-full h-[56px] rounded-md focus:border-[var(--main-brand-color-1)] focus:ring-[var(--main-brand-color-1)]"
        />
      </label>
      <span v-if="state.errors?.password" class="text-red-500">{{ state.errors.password }}</span>
    </div>
    <!-- button -->
    <div class="flex items-center justify-center w-full">
      <button
        @click="loginHandler"
        class="w-full h-[48px] text-white text-base bg-[var(--main-brand-color-1)] rounded-md tracking-widest"
      >
        登入
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
