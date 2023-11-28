<script setup lang="ts">
import { toRaw, reactive, ref, watch, computed } from 'vue'
import { useFormValidation } from '@/composables/validation/useFormValidation'
import useGlobalStore from '@/stores/global/global'
import TextInput from '../FormItem/TextInput.vue'
import PureText from '../FormItem/PureText.vue'
import DateInput from '../FormItem/DateInput.vue'
import TimeInput from '../FormItem/TimeInput.vue'
import AvatarInput from '../FormItem/AvatarInput.vue'
import SingleFileInput from '../FormItem/SingleFileInput.vue'
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

const globalStore = useGlobalStore()
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
      // image 類型如果是 null 要轉換成 ['']，給 vue-upload-component 做 v-model 綁定
      if (key === 'avatar') {
        if (!Array.isArray(itemData[key])) itemData[key] = [itemData[key]]
        formData[key] = itemData[key][0] ? itemData[key] : ['']
      } else {
        formData[key] = itemData[key]
      }
    }
    console.log(itemData)
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

function clearFile(prop: string) {
  formData[prop] = []
}

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

// modal title
const formModalTitle = computed(() => {
  const prefix = isCreateModal.value ? '新增' : '編輯'
  return prefix + props.modalTitle
})

const resolveComponent = (type: string) => {
  if (type === 'text') return TextInput
  if (type === 'pureText') return PureText
  if (type === 'date') return DateInput
  if (type === 'time') return TimeInput
  if (type === 'avatar') return AvatarInput
  if (type === 'singleFile') return SingleFileInput
}

defineExpose({
  setModalVisible
})
</script>

<template>
  <div v-show="isModalVisible" class="fixed top-0 left-0 w-full h-full bg-black/10 z-50">
    <div @click.self="(event) => setModalVisible()" class="relative w-full h-full">
      <div
        class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[300px] max-h-[500px] bg-white rounded-lg overflow-scroll shadow-lg overflow-y-auto md:w-[530px] md:max-h-auto"
      >
        <header
          class="sticky top-0 flex items-center border-b-[1px] px-[20px] py-[12px] text-[var(--main-brand-color-1)] z-10 bg-white"
        >
          <h4 class="text-lg md:text-xl">{{ formModalTitle }}</h4>
          <button
            @click="(event) => setModalVisible()"
            class="flex items-center justify-center ml-auto w-[24px] h-[24px] text-lg md:text-xl"
          >
            <img src="@/assets/images/icon/cancel_icon.svg" alt="close" />
          </button>
        </header>
        <!-- 表單主要內容 -->
        <div class="mx-auto px-[20px] py-[15px] min-h-[100px] space-y-[20px]">
          <div v-for="formField in formFields" :key="formField.prop">
            <component
              :is="resolveComponent(formField.type)"
              v-model="formData[formField.prop]"
              v-bind="formField"
              :label="formField.title"
              :fieldId="formField.prop"
              :error="errors[formField.prop]"
              @blur="validateField(formField.prop)"
              @onClosed="validateField(formField.prop, formField.refFields)"
              @onCleared="validateField(formField.prop, formField.refFields)"
              @onClearFile="clearFile(formField.prop)"
            />
          </div>
        </div>
        <footer
          class="sticky bottom-0 flex justify-end border-t-[1px] px-[20px] py-[12px] z-10 bg-white"
        >
          <button
            @click="submitHandler"
            class="ml-auto px-[20px] py-[6px] bg-[var(--main-brand-color-1)] text-white text-xs md:text-sm rounded-lg"
            :disabled="globalStore.isLoading"
          >
            {{ buttonText }}
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
