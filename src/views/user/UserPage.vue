<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useUserStore from '@/stores/user/user'
import DefaultAvatar from '@/assets/images/icon/default_avatar_icon.svg'
import FormModal from '@/components/common/formModal/FormModal.vue'
import useFormModal from '@/composables/modal/useFormModal'
import { schema, formFields } from './config/formFields'

import type { IUpdateUserParams } from '@/services/user/type'

const userStore = useUserStore()
const userEditInfo = ref<{ name: string; avatar: any }>({ name: '', avatar: null })

watch(
  () => userStore.userInfo,
  (newVal) => (userEditInfo.value = { ...newVal }),
  { immediate: true, deep: true }
)

const { formMadalRef, editClickHandler } = useFormModal()

async function updateSubmitHandler(data: any) {
  const params: IUpdateUserParams = { name: data.name, avatar: null }

  if (typeof data.avatar[0] === 'string') {
    params.avatar = data.avatar[0]
  } else if (typeof data.avatar[0] === 'object') {
    params.avatar = data.avatar[0].file
  }

  const result = await userStore.updateUserInfoAction(params)
  // 關閉表單
  if (result.success) formMadalRef.value?.setModalVisible()
}

onMounted(async () => {
  await userStore.getUserInfoAction()
})
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
    <!-- user info section -->
    <div class="bg-white pt-[44px] lg:pt-0 lg:pb-[30px] lg:pl-[20%]">
      <div class="flex flex-col px-[24px] pt-0 h-full lg:pt-[18%]">
        <h2
          class="mb-[28px] text-[26px] text-[var(--main-brand-color-1)] tracking-widest md:text-[32px] lg:mb-[54px]"
        >
          個人資料
        </h2>
        <!-- avatar -->
        <div class="mb-[28px] lg:mb-[54px]">
          <div class="relative mb-[16px]">
            <img
              v-default-image="DefaultAvatar"
              :src="userStore.userInfo?.avatar || DefaultAvatar"
              class="w-[108px] h-[108px] rounded-full object-cover object-center overflow-hidden"
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

        <!-- button -->
        <div class="flex justify-start mt-[24px]">
          <button
            @click="editClickHandler(userEditInfo)"
            class="px-[20px] py-[6px] bg-[var(--main-brand-color-1)] text-white text-xs md:text-sm rounded-lg"
          >
            編輯
          </button>
        </div>
      </div>
    </div>

    <FormModal
      ref="formMadalRef"
      modalTitle="編輯個人資訊"
      :formFields="formFields"
      :schema="schema"
      @updateSubmit="updateSubmitHandler"
    >
    </FormModal>
  </div>
</template>

<style lang="less" scoped></style>
