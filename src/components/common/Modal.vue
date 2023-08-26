<script setup lang="ts">
import { ref } from 'vue'

const isModalVisible = ref(false)
const modalMessage = ref('')
const emit = defineEmits(['clickConfirm'])

function setModalVisible(isOpen: boolean) {
  isModalVisible.value = isOpen
  if (!isModalVisible.value) setModalMessage('')
}

function setModalMessage(message: string) {
  modalMessage.value = message
}

function clickConfirmHandler() {
  emit('clickConfirm')
}

defineExpose({ setModalVisible, setModalMessage })
</script>

<template>
  <!-- isModalVisible -->
  <div v-if="isModalVisible" class="fixed top-0 left-0 w-full h-full bg-black/10 z-10">
    <div @click.self="setModalVisible(false)" class="relative w-full h-full">
      <div
        class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[300px] md:w-[530px] bg-white rounded-lg overflow-hidden shadow-lg"
      >
        <header
          class="flex items-center border-b-[1px] px-[20px] py-[12px] text-[var(--main-brand-color-1)]"
        >
          <h4 class="text-lg md:text-xl">系統訊息</h4>
          <button
            @click="setModalVisible(false)"
            class="flex items-center justify-center ml-auto w-[24px] h-[24px] text-lg md:text-xl"
          >
            <img src="@/assets/images/icon/cancel_icon.svg" alt="close" />
          </button>
        </header>
        <div class="mx-auto px-[20px] py-[15px] min-h-[100px]">
          <p>{{ modalMessage }}</p>
        </div>
        <footer class="flex justify-end border-t-[1px] px-[20px] py-[12px]">
          <button
            @click="clickConfirmHandler"
            class="ml-auto px-[20px] py-[6px] bg-[var(--main-brand-color-1)] text-white text-xs md:text-sm rounded-lg"
          >
            OK
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
