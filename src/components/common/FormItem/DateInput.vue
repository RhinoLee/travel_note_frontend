<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export interface Props {
  modelValue: Date | string | null
  label: string
  fieldId: string
  error: string | undefined
  yearsRange?: number[]
  minDate?: string
  maxDate?: string
  enableTimePicker?: boolean
}

defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'onClosed', 'onCleared'])

const handleUpdate = (modelData: string) => {
  emit('update:modelValue', modelData)
}
</script>

<template>
  <label class="form-modal-label" :for="fieldId">{{ label }}</label>
  <VueDatePicker
    :model-value="modelValue"
    @update:model-value="handleUpdate"
    :id="fieldId"
    :year-range="yearsRange"
    :min-date="minDate"
    :max-date="maxDate"
    :enable-time-picker="enableTimePicker"
    :teleport="true"
    @closed="$emit('onClosed')"
    @cleared="$emit('onCleared')"
  ></VueDatePicker>
  <p v-if="error" class="text-red-500">{{ error }}</p>
</template>
