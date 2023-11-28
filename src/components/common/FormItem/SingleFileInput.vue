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

const { previewFile, inputFile, inputFilter, upload } = useFileUpload()

// 當 file-upload 的值改變時處理輸入
const handleInput = () => {
  emit('update:modelValue', [previewFile])
}
</script>

<template>
  <!-- 預覽圖片區域 -->
  <div v-if="previewFile && previewFile.blob">
    <img :src="previewFile.blob" class="w-full max-h-[200px] object-cover object-center" />
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

<style lang="less" scoped></style>
