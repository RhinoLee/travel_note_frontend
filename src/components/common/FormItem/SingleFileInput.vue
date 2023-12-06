<script setup lang="ts">
import { useFileDialog, useObjectUrl } from '@vueuse/core'
import { ref, type Ref } from 'vue'

export interface Props {
  modelValue: File | null
  label: string
  fieldId: string
}

defineProps<Props>()

// todo -> 'onClearFile'
const emit = defineEmits(['update:modelValue'])

const { files, open, reset, onChange } = useFileDialog({
  accept: 'image/*' // Set to accept only image files
})

const previewUrl: Ref<string | undefined> = ref()

onChange((files) => {
  const file = files ? files[0] : null
  previewUrl.value = useObjectUrl(file).value
  emit('update:modelValue', files ? files[0] : file)
})
</script>

<template>
  <label class="form-modal-label">{{ label }}</label>
  <!-- 預覽圖片區域 -->
  <div v-if="previewUrl" class="mb-[8px]">
    <img :src="previewUrl" class="w-full max-h-[200px] object-cover object-center" />
  </div>
  <button
    @click="open()"
    class="ml-auto px-[20px] py-[6px] bg-[var(--main-brand-color-1)] text-white text-xs md:text-sm rounded-lg"
  >
    上傳圖片
  </button>
</template>

<style lang="less" scoped></style>
