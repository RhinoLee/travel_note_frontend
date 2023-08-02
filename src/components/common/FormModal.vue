<script setup lang="ts">
import { toRaw, reactive, ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export interface IFormField {
  prop: string
  title: string
  type: string
  placeholder: string
  rules: any[]
  initValue: any
}

export interface IModalProps {
  modalTitle: string
  modalBanner?: string
  formFields: IFormField[]
}

export interface IFormData {
  [key: string]: string
}

const emit = defineEmits<{
  updateSubmit: [data: IFormData]
  createSubmit: [data: IFormData]
}>()

const props = withDefaults(defineProps<IModalProps>(), {
  modalBanner: ''
})

const isCreateModal = ref(true)
const editData = ref()
const buttonText = ref('')

const initialFormData: IFormData = {}
for (const formItem of props.formFields) {
  initialFormData[formItem.prop] = formItem.initValue ?? ''
}
const formData: IFormData = reactive(initialFormData)

const isModalVisible = ref(false)
function closeModal() {
  isModalVisible.value = false
}

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
}

function submitHandler() {
  // 編輯模式
  if (!isCreateModal.value && editData.value) {
    emit('updateSubmit', toRaw(formData))
  } else {
    emit('createSubmit', toRaw(formData))
  }
}

defineExpose({
  setModalVisible
})
</script>

<template>
  <div v-if="isModalVisible" class="fixed top-0 left-0 w-full h-full bg-black/10 z-10">
    <div @click.self="closeModal" class="relative w-full h-full">
      <div
        class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[300px] md:w-[530px] bg-white rounded-lg overflow-hidden shadow-lg overflow-y-auto"
      >
        <header
          class="flex items-center border-b-[1px] px-[20px] py-[12px] text-[var(--main-brand-color-1)]"
        >
          <h4 class="text-lg md:text-xl">{{ props.modalTitle }}</h4>
          <button
            @click="closeModal"
            class="flex items-center justify-center ml-auto w-[24px] h-[24px] text-lg md:text-xl"
          >
            <img src="@/assets/images/icon/cancel_icon.svg" alt="close" />
          </button>
        </header>
        <div class="mx-auto px-[20px] py-[15px] min-h-[100px] space-y-[20px]">
          <div v-for="formField in formFields" :key="formField.prop">
            <template v-if="formField.type === 'text'">
              <div>
                <label class="form-modal-label" :for="formField.prop">{{ formField.title }}</label>
                <input
                  type="text"
                  v-model.trim="formData[formField.prop]"
                  class="block border-[var(--gray-color-1)] mt-1 px-3 py-2 w-full h-[36px] rounded-md"
                />
              </div>
            </template>
            <template v-if="formField.type === 'date'">
              <div>
                <label class="form-modal-label" :for="formField.prop">{{ formField.title }}</label>
                <VueDatePicker
                  :id="formField.prop"
                  v-model="formData[formField.prop]"
                  :teleport="true"
                ></VueDatePicker>
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
