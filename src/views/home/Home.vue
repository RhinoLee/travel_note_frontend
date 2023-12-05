<script setup lang="ts">
import { ref } from 'vue'
import TripList from './components/TripList.vue'
import FormModal from '@/components/common/formModal/FormModal.vue'
import useFormModal from '@/composables/modal/useFormModal'
import { formFields } from './config/formFields'
import useTripsStore from '@/stores/trips/trips'
import { notify } from '@kyvg/vue3-notification'
import { CREATE_SUCCESS_MESSAGE, CREATE_FAILED_MESSAGE } from '@/common/constants'
import { tripSchema } from '@/composables/validation/schema/tripSchema'
import type { ITripParams } from '@/services/trips/type'

const tripListRef = ref<InstanceType<typeof TripList> | null>(null)

async function createSubmitHandler(data: ITripParams) {
  // 整理 data 成 API 所需格式
  const tripsStore = useTripsStore()
  tripsStore.setCreateData(data)

  try {
    const result = await tripsStore.createTrip()
    tripsStore.setCreateData(null)
    if (result.success) {
      notify({ type: 'success', text: CREATE_SUCCESS_MESSAGE })
      await tripListRef.value?.getTripsHandler()
    } else {
      notify({ type: 'error', text: CREATE_FAILED_MESSAGE })
    }
  } catch (error) {
    notify({ type: 'error', text: CREATE_FAILED_MESSAGE })
  }

  formMadalRef.value?.setModalVisible()
}

function updateSubmitHandler(data: any) {
  console.log('createSubmitHandler', data)
}

const { formMadalRef, createClickHandler } = useFormModal()
</script>

<template>
  <div class="container mx-auto pb-[50px] pt-[30px] px-[30px] md:pt-[50px]">
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
      modalTitle="旅程"
      :formFields="formFields"
      :schema="tripSchema"
      @createSubmit="createSubmitHandler"
      @updateSubmit="updateSubmitHandler"
    >
    </FormModal>
  </div>
</template>
