import { ref } from 'vue'
import type FormModal from '@/components/common/formModal/FormModal.vue'

const useFormModal = () => {
  const formMadalRef = ref<InstanceType<typeof FormModal> | null>(null)

  function createClickHandler() {
    formMadalRef.value?.setModalVisible()
  }
  function editClickHandler(itemData: any) {
    formMadalRef.value?.setModalVisible(false, itemData)
  }

  return { formMadalRef, createClickHandler, editClickHandler }
}

export default useFormModal
