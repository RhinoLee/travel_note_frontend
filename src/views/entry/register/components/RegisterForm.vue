<script setup lang="ts">
import { reactive } from 'vue'
import { registerAPI } from '@/services/user'
import type { IRegisterParams } from '@/services/user/type'
import { notify } from '@kyvg/vue3-notification'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData: IRegisterParams = reactive({
  name: '',
  email: '',
  password: '',
  provider: 'email',
  provider_id: null
})

async function registerHandler() {
  try {
    const res: any = await registerAPI(formData)
    // 清空表單資料
    if (res.success) {
      notify({ type: 'success', text: '註冊成功，請登入' })

      for (const item in formData) {
        if (item === 'provider_id') formData[item] = null
        else formData[item] = ''
      }

      router.push({ name: 'login' })
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="max-w-[364px] flex flex-col items-center mx-auto">
    <!-- form-item -->
    <div class="py-[10px] w-full">
      <label class="block">
        <span class="block text-base text-[var(--main-brand-color-1)] tracking-wider">名稱</span>
        <input
          type="text"
          v-model.trim="formData.name"
          class="block border-[var(--gray-color-1)] mt-1 px-3 py-2 w-full h-[56px] rounded-md focus:border-[var(--main-brand-color-1)] focus:ring-[var(--main-brand-color-1)]"
        />
      </label>
    </div>
    <!-- form-item -->
    <div class="py-[10px] w-full">
      <label class="block">
        <span class="block text-base text-[var(--main-brand-color-1)] tracking-wider">信箱</span>
        <input
          type="text"
          v-model.trim="formData.email"
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
          v-model.trim="formData.password"
          class="block border-[var(--gray-color-1)] mt-1 px-3 py-2 w-full h-[56px] rounded-md focus:border-[var(--main-brand-color-1)] focus:ring-[var(--main-brand-color-1)]"
        />
      </label>
    </div>
    <!-- button -->
    <div class="flex items-center justify-center">
      <button
        @click="registerHandler"
        class="mt-[25px] w-[144px] h-[40px] text-white text-base bg-[var(--main-brand-color-1)] shadow-custom rounded-md tracking-widest"
      >
        註冊
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
@/services/user
