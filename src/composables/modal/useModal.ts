import { ref } from 'vue'
import type { Ref } from 'vue'
import type Modal from '@/components/common/Modal.vue'

/**
 *
 * @returns {
 *  modalRef: Modal 組件實例。
 *  modalData: 傳給的資料，通常用在 confirmActions。
 *  confirmActions: 按下 confirm 按鈕後要呼叫的 Fn。
 *  setConfirmActions: 設定按下 confirm 按鈕後要呼叫的 Fn。
 *  setModalMessage: 設定 Modal message。
 *  openModal: 開起 Modal。
 *  closeModal: 關閉 Modal。
 *  executeConfirmAction: 執行先前設定好的 confirmActions。
 * }
 */

const useModal = () => {
  const modalRef = ref<InstanceType<typeof Modal> | null>(null)
  const modalData: any = ref(null)
  const confirmActions: Ref<Function | undefined> = ref(undefined)

  function openModal(modalMessage: string, data: any, confirmAction: Function | undefined) {
    modalRef.value?.setModalVisible(true)
    modalData.value = data
    setModalMessage(modalMessage)
    setConfirmActions(confirmAction)
  }

  function closeModal() {
    modalRef.value?.setModalVisible(false)
  }

  function setModalMessage(message: string) {
    modalRef.value?.setModalMessage(message)
  }

  function setConfirmActions(fn: Function | undefined) {
    confirmActions.value = fn
  }

  async function executeConfirmAction() {
    // if (confirmActions.value) return await confirmActions.value(modalData.value)
    let result = null
    if (confirmActions.value) {
      if (confirmActions.value instanceof Promise) {
        result = await confirmActions.value(modalData.value)
      } else {
        // 若是同步函數，則轉換為Promise
        result = Promise.resolve(confirmActions.value(modalData.value))
      }
    }

    closeModal()
    return result
  }

  return {
    modalRef,
    modalData,
    confirmActions,
    setConfirmActions,
    setModalMessage,
    openModal,
    closeModal,
    executeConfirmAction
  }
}

export default useModal
