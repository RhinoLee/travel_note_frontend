import { ref } from 'vue'
import type FormModal from '@/components/common/formModal/FormModal.vue'

const useFormModal = () => {
  const formMadalRef = ref<InstanceType<typeof FormModal> | null>(null)

  function createClickHandler() {
    formMadalRef.value?.setModalVisible()
  }
  function editClickHandler() {
    formMadalRef.value?.setModalVisible(false)
  }

  return { formMadalRef, createClickHandler, editClickHandler }
}

export default useFormModal
