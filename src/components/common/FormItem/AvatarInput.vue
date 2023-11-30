<script setup lang="ts">
import { useFileUpload } from '@/composables/fileUpload/useFileUpload'
import DefaultAvatar from '@/assets/images/icon/default_avatar_icon.svg'

export interface Props {
  modelValue: any[]
  label: string
  fieldId: string
}

defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'onClearFile'])

const { previewFile, inputFile, inputFilter, clearPreviewFile, upload } = useFileUpload()

// 當 file-upload 的值改變時處理輸入
const handleInput = () => {
  emit('update:modelValue', [previewFile])
}

const onClearFile = () => {
  clearPreviewFile()
  emit('onClearFile')
}
</script>

<template>
  <!-- 預覽圖片區域 -->
  <div v-if="(previewFile && previewFile.blob) || modelValue" class="relative mb-[16px]">
    <img
      v-default-image="DefaultAvatar"
      :src="previewFile?.blob || modelValue[0] || DefaultAvatar"
      class="w-[108px] h-[108px] rounded-full object-cover object-center overflow-hidden"
      alt=""
    />
    <!-- delete icon -->
    <div
      @click="onClearFile"
      class="absolute bottom-[4px] left-[78px] flex items-center justify-center w-[32px] h-[32px] bg-[var(--green-color-1)] rounded-full overflow-hidden cursor-pointer"
    >
      <img src="@/assets/images/icon/delete_icon.svg" />
    </div>
  </div>
  <label class="form-modal-label" :for="fieldId">{{ label }}</label>
  <file-upload
    ref="upload"
    :value="modelValue"
    @input="handleInput"
    @input-file="inputFile"
    @input-filter="inputFilter"
  >
    <button
      class="ml-auto px-[20px] py-[6px] bg-[var(--main-brand-color-1)] text-white text-xs md:text-sm rounded-lg"
    >
      上傳圖片
    </button>
  </file-upload>
</template>
