<script setup lang="ts">
import { ref } from 'vue'
import TripList from './components/TripList.vue'
import FormModal from '@/components/common/formModal/FormModal.vue'
import useFormModal from '@/composables/modal/useFormModal'
import { formFields, schema } from './config/formFields'
import useTripsStore from '@/stores/trips/trips'
import { notify } from '@kyvg/vue3-notification'

const tripListRef = ref<InstanceType<typeof TripList> | null>(null)

async function createSubmitHandler(data: any) {
  // 整理 data 成 API 所需格式
  const tripsStore = useTripsStore()
  tripsStore.setCreateData(data)
  try {
    const result = await tripsStore.createTrip()
    tripsStore.setCreateData(null)
    if (result.success) {
      notify({ type: 'success', text: '新增旅程成功' })
      await tripListRef.value?.getTripsHandler()
    } else {
      notify({ type: 'error', text: '新增旅程失敗' })
    }
  } catch (error) {
    notify({ type: 'error', text: '新增旅程失敗' })
  }

  formMadalRef.value?.setModalVisible()
}

function updateSubmitHandler(data: any) {
  console.log('createSubmitHandler', data)
}

const { formMadalRef, createClickHandler } = useFormModal()
</script>

<template>
  <div class="container mx-auto px-[30px]">
    <!-- title -->
    <h2 class="mb-[4px] text-[var(--main-brand-color-1)] text-2xl">規劃行程</h2>
    <!-- add schedule button -->
    <div class="mb-[10px] py-[12px]">
      <button
        @click="createClickHandler"
        class="px-[8px] py-[4px] bg-[var(--main-brand-color-1)] text-white text-sm rounded-md"
      >
        +New
      </button>
    </div>
    <!-- schedule list -->
    <TripList ref="tripListRef"></TripList>

    <!-- create/edit Modal -->
    <FormModal
      ref="formMadalRef"
      modalTitle="新增旅程"
      :formFields="formFields"
      :schema="schema"
      @createSubmit="createSubmitHandler"
      @updateSubmit="updateSubmitHandler"
    >
    </FormModal>
  </div>
</template>
