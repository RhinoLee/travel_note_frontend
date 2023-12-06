<script setup lang="ts">
import { toRaw, reactive, ref, watch, computed } from 'vue'
import { useValidation } from '@/composables/validation/useValidation'
import useGlobalStore from '@/stores/global/global'
import { resolveProps } from '@/components/common/formModal/config/resolveProps'
import { resolveComponent } from '@/components/common/formModal/config/resolveComponent'
import type { IModalProps, IFormModalData } from './config/types'

// 這個組件會透過上層 formFields 配置文件，來產生對應的表單欄位
// 這個組件不做客製化資料處理，需要在上層組件中，自行處理資料格式

const emit = defineEmits<{
  updateSubmit: [data: any]
  createSubmit: [data: any]
}>()

const props = withDefaults(defineProps<IModalProps>(), {})

const globalStore = useGlobalStore()

const isCreateModal = ref(true)
const editData = ref()
const buttonText = ref('')

const initialFormData: IFormModalData = {}
// 設定初始值（可參考 src/views/home/config/formFields.ts）
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
const { state, validate, resetValidator } = useValidation(props.schema)

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
      // image 類型如果是 null 要轉換成 ['']，給 vue-upload-component 做 v-model 綁定
      // if (key === 'avatar') {
      //   if (!Array.isArray(itemData[key])) itemData[key] = [itemData[key]]
      //   formData[key] = itemData[key][0] ? itemData[key] : ['']
      // } else {
      //   formData[key] = itemData[key]
      // }
    }

    editData.value = itemData
  } else {
    // 新增模式
    buttonText.value = '新增'
    for (const key in formData) {
      props.formFields.find((formField) => formField.prop === key)?.initValue ?? ''
    }
  }

  if (!isModalVisible.value) resetValidator()
}

function clearFile(prop: string) {
  formData[prop] = null
}

// modal submit
async function submitHandler() {
  const isValid = await validate(toRaw(formData))

  if (!isValid) return
  // 編輯模式
  if (!isCreateModal.value && editData.value) {
    emit('updateSubmit', toRaw(formData))
  } else {
    emit('createSubmit', toRaw(formData))
  }
}

// modal title
const formModalTitle = computed(() => {
  const prefix = isCreateModal.value ? '新增' : '編輯'
  return prefix + props.modalTitle
})

// 根據不同 formItem component 設定專屬 emits
function resolveEmits(formField: any): any {
  switch (formField.type) {
    case 'text':
      return {
        blur: () => validate(toRaw(formData))
      }
    case 'date':
    case 'time':
      return {
        onClosed: () => validate(toRaw(formData)),
        onCleared: () => validate(toRaw(formData))
      }
    case 'avatar':
    case 'singleFile':
      return {
        onClearFile: () => clearFile(formField.prop)
      }
    default:
      return {}
  }
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
              v-bind="resolveProps(formField, state.errors)"
              v-on="resolveEmits(formField)"
            />
          </div>
        </div>
        <footer
          class="sticky bottom-0 flex justify-end border-t-[1px] px-[20px] py-[12px] z-10 bg-white"
        >
          <button
            @click="submitHandler"
            id="submit-btn"
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
