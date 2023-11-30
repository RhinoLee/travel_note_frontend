<script setup lang="ts">
import VueDatePicker, { type TimeModel } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export interface Props {
  modelValue: TimeModel | null
  label: string
  fieldId: string
  error: string | undefined
  startTime?: Object
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
    time-picker
    :model-value="modelValue"
    @update:model-value="handleUpdate"
    :id="fieldId"
    :teleport="true"
    :start-time="startTime"
    minutes-increment="5"
    @closed="$emit('onClosed')"
    @cleared="$emit('onCleared')"
  ></VueDatePicker>
  <p v-if="error" class="text-red-500">{{ error }}</p>
</template>

<style lang="less" scoped></style>
