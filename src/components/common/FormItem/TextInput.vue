<script setup lang="ts">
export interface Props {
  modelValue: string
  label: string
  fieldId: string
  error: string
}

defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'blur'])

const onBlur = () => {
  emit('blur')
}
</script>

<template>
  <label :for="fieldId">{{ label }}</label>
  <input
    :id="fieldId"
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @blur="onBlur"
    class="block border-[var(--gray-color-1)] mt-1 px-3 py-2 w-full h-[36px] rounded-md"
  />
  <p v-if="error" class="text-red-500">{{ error }}</p>
</template>
