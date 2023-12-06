<script setup lang="ts">
import { useFileDialog, useObjectUrl } from '@vueuse/core'
import DefaultAvatar from '@/assets/images/icon/default_avatar_icon.svg'
import { ref, watch, type Ref } from 'vue'

export interface Props {
  modelValue: string | File
  label: string
  fieldId: string
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'onClearFile'])

const { files, open, reset, onChange } = useFileDialog({
  accept: 'image/*'
})

const previewUrl: Ref<string | undefined> = ref()

onChange((files) => {
  const file = files ? files[0] : null
  previewUrl.value = useObjectUrl(file).value
  emit('update:modelValue', files ? files[0] : file)
})

function onClearFile() {
  emit('onClearFile')
  reset()
}

watch(
  () => props.modelValue,
  (file) => {
    if (typeof file === 'string') previewUrl.value = file
    else if (file === null) previewUrl.value = ''
  },
  { immediate: true }
)
</script>

<template>
  <!-- 預覽圖片區域 -->
  <div v-if="previewUrl || DefaultAvatar" class="relative mb-[16px]">
    <label class="form-modal-label">{{ label }}</label>
    <img
      v-default-image="DefaultAvatar"
      :src="previewUrl || DefaultAvatar"
      class="w-[108px] h-[108px] rounded-full object-cover object-center overflow-hidden"
      alt=""
    />
    <!-- delete icon -->
    <button
      @click="onClearFile"
      :disabled="!previewUrl"
      class="absolute bottom-[4px] left-[78px] flex items-center justify-center w-[32px] h-[32px] bg-[var(--green-color-1)] rounded-full overflow-hidden"
    >
      <img src="@/assets/images/icon/delete_icon.svg" />
    </button>
  </div>
  <button
    @click="open()"
    class="ml-auto px-[20px] py-[6px] bg-[var(--main-brand-color-1)] text-white text-xs md:text-sm rounded-lg"
  >
    上傳圖片
  </button>
</template>
