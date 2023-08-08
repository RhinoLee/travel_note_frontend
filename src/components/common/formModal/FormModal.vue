<script setup lang="ts">
import { toRaw, reactive, ref, watch, watchEffect } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useFileUpload } from '@/composables/fileUpload/useFileUpload'
import { useFormValidation } from '@/composables/validation/useFormValidation'
import type { IModalProps, IFormModalData } from './config/types'

// 這個組件會透過上層 formFields 配置文件，來產生對應的表單欄位
// 這個組件不做客製化資料處理，需要在上層組件中，自行處理資料格式

const emit = defineEmits<{
  updateSubmit: [data: IFormModalData]
  createSubmit: [data: IFormModalData]
}>()

const props = withDefaults(defineProps<IModalProps>(), {
  modalBanner: ''
})

const isCreateModal = ref(true)
const editData = ref()
const buttonText = ref('')

const initialFormData: IFormModalData = {}
for (const formItem of props.formFields) {
  initialFormData[formItem.prop] = formItem.initValue ?? ''
}
// template v-model 表單資料
const formData: IFormModalData = reactive(initialFormData)

// 上層 formFields 改變時，更新 formData init value
watch(
  () => props.formFields,
  () => {
    for (const formItem of props.formFields) {
      formData[formItem.prop] = formItem.initValue ?? ''
    }
  },
  { immediate: true, deep: true }
)

// 驗證規則
const { errors, validate, validateField, clearErrors } = useFormValidation(props.schema, formData)

const isModalVisible = ref(false)

/**
 * 設定 Modal 的顯示狀態 & 對應資料顯示
 * @param isCreate - 是否為新增模式
 * @param itemData - 編輯模式下，傳入的資料，並寫入 formData 中
 */
function setModalVisible(isCreate: boolean = true, itemData: any = {}) {
  isModalVisible.value = !isModalVisible.value
  isCreateModal.value = isCreate

  // 編輯模式
  if (!isCreate) {
    buttonText.value = '更新'
    for (const key in formData) {
      formData[key] = itemData[key]
    }
    editData.value = itemData
  } else {
    // 新增模式
    buttonText.value = '新增'
    for (const key in formData) {
      props.formFields.find((formField) => formField.prop === key)?.initValue ?? ''
    }
  }

  if (!isModalVisible.value) clearErrors()
}

// file upload
const { previewFile, inputFile, inputFilter, upload } = useFileUpload()

// modal submit
async function submitHandler() {
  try {
    await validate()
    // 編輯模式
    if (!isCreateModal.value && editData.value) {
      emit('updateSubmit', toRaw(formData))
    } else {
      emit('createSubmit', toRaw(formData))
    }
  } catch (err) {
    console.log('submitHandler err', err)
  }
}

defineExpose({
  setModalVisible
})
</script>

<template>
  <div v-if="isModalVisible" class="fixed top-0 left-0 w-full h-full bg-black/10 z-50">
    <div @click.self="(event) => setModalVisible()" class="relative w-full h-full">
      <div
        class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[300px] md:w-[530px] bg-white rounded-lg overflow-hidden shadow-lg overflow-y-auto"
      >
        <header
          class="flex items-center border-b-[1px] px-[20px] py-[12px] text-[var(--main-brand-color-1)]"
        >
          <h4 class="text-lg md:text-xl">{{ props.modalTitle }}</h4>
          <button
            @click="(event) => setModalVisible()"
            class="flex items-center justify-center ml-auto w-[24px] h-[24px] text-lg md:text-xl"
          >
            <img src="@/assets/images/icon/cancel_icon.svg" alt="close" />
          </button>
        </header>
        <div v-if="previewFile && previewFile.blob">
          <img :src="previewFile.blob" class="w-full max-h-[230px] object-cover object-center" />
        </div>
        <div class="mx-auto px-[20px] py-[15px] min-h-[100px] space-y-[20px]">
          <div v-for="formField in formFields" :key="formField.prop">
            <template v-if="formField.type === 'singleFile'">
              <label class="form-modal-label" :for="formField.prop">{{ formField.title }}</label>
              <file-upload
                ref="upload"
                v-model="formData[formField.prop]"
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
            <template v-if="formField.type === 'text'">
              <div>
                <label class="form-modal-label" :for="formField.prop">{{ formField.title }}</label>
                <input
                  type="text"
                  v-model.trim="formData[formField.prop]"
                  @input="validateField(formField.prop)"
                  @blur="validateField(formField.prop)"
                  class="block border-[var(--gray-color-1)] mt-1 px-3 py-2 w-full h-[36px] rounded-md"
                />
                <p class="text-red-500">{{ errors[formField.prop] }}</p>
              </div>
            </template>
            <template v-if="formField.type === 'date'">
              <div>
                <label class="form-modal-label" :for="formField.prop">{{ formField.title }}</label>
                <VueDatePicker
                  v-model="formData[formField.prop]"
                  :id="formField.prop"
                  :year-range="formField.yearsRange || undefined"
                  :min-date="formField.minDate || undefined"
                  :max-date="formField.maxDate || undefined"
                  :enable-time-picker="formField.enableTimePicker"
                  :teleport="true"
                  @closed="validateField(formField.prop, formField.refFields)"
                  @cleared="validateField(formField.prop, formField.refFields)"
                ></VueDatePicker>
                <p class="text-red-500">{{ errors[formField.prop] }}</p>
              </div>
            </template>
            <template v-if="formField.type === 'time'">
              <div>
                <label class="form-modal-label" :for="formField.prop">{{ formField.title }}</label>
                <VueDatePicker
                  time-picker
                  v-model="formData[formField.prop]"
                  :id="formField.prop"
                  :teleport="true"
                  @closed="validateField(formField.prop, formField.refFields)"
                  @cleared="validateField(formField.prop, formField.refFields)"
                ></VueDatePicker>
                <p class="text-red-500">{{ errors[formField.prop] }}</p>
              </div>
            </template>
          </div>
        </div>
        <footer class="flex justify-end border-t-[1px] px-[20px] py-[12px]">
          <button
            @click="submitHandler"
            class="ml-auto px-[20px] py-[6px] bg-[var(--main-brand-color-1)] text-white text-xs md:text-sm rounded-lg"
          >
            {{ buttonText }}
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
./config
