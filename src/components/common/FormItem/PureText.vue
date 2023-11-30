<script setup lang="ts">
export interface Props {
  modelValue: string
  label: string
}

defineProps<Props>()
</script>

<template>
  <div>
    <label class="form-modal-label">{{ label }}</label>
    <div class="block border-[var(--gray-color-1)] mt-1 py-2 w-full h-[36px] rounded-md">
      {{ modelValue }}
    </div>
  </div>
</template>

<style lang="less" scoped></style>
