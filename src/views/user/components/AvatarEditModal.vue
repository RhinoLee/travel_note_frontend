<script setup lang="ts">
import { ref } from 'vue'
import useUserStore from '@/stores/user/user'
import DefaultAvatar from '@/assets/images/icon/default_avatar_icon.svg'
import { useFileUpload } from '@/composables/fileUpload/useFileUpload'

const isModalVisible = ref(false)

function setVisible() {
  isModalVisible.value = !isModalVisible.value
}

const userStore = useUserStore()
const { previewFile, inputFile, inputFilter, upload } = useFileUpload()

defineExpose({ setVisible })
</script>

<template>
  <!-- isModalVisible -->
  <div v-if="isModalVisible" class="fixed top-0 left-0 w-full h-full bg-black/10 z-10">
    <div @click.self="setVisible" class="relative w-full h-full">
      <div
        class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[300px] md:w-[530px] bg-white rounded-lg overflow-hidden shadow-lg"
      >
        <header
          class="flex items-center border-b-[1px] px-[20px] py-[12px] text-[var(--main-brand-color-1)]"
        >
          <h4 class="text-lg md:text-xl">編輯大頭貼</h4>
          <button
            @click="setVisible"
            class="flex items-center justify-center ml-auto w-[24px] h-[24px] text-lg md:text-xl"
          >
            <img src="@/assets/images/icon/cancel_icon.svg" alt="close" />
          </button>
        </header>
        <div class="mx-auto px-[20px] py-[15px] min-h-[100px]">
          <div class="relative mb-[16px]">
            <img
              v-default-image="DefaultAvatar"
              :src="previewFile?.blob || userStore.userInfo?.avatar"
              class="w-[108px] h-[108px] rounded-full object-cover object-center overflow-hidden"
              alt=""
            />
          </div>
          <div class="flex gap-[4px] items-center">
            <file-upload ref="upload" @input-file="inputFile" @input-filter="inputFilter">
              <button
                class="px-[20px] py-[6px] bg-[var(--main-brand-color-1)] text-white text-xs md:text-sm rounded-lg"
              >
                編輯頭貼
              </button>
            </file-upload>
          </div>
        </div>
        <footer class="flex justify-end gap-[8px] border-t-[1px] px-[20px] py-[12px]">
          <button
            @click="setVisible"
            class="px-[20px] py-[6px] bg-[var(--main-brand-color-1)] text-white text-xs md:text-sm rounded-lg"
          >
            送出
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
