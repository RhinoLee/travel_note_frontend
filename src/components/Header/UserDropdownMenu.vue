<script setup lang="ts">
import { ref } from 'vue'
import { vOnClickOutside } from '@vueuse/components'

import type { OnClickOutsideHandler } from '@vueuse/core'

const isVisable = ref(false)

function setDropdownVisable() {
  isVisable.value = !isVisable.value
}

const dropdownHandler: OnClickOutsideHandler = (event) => {
  isVisable.value = false
}

defineExpose({
  setDropdownVisable
})
</script>

<template>
  <div
    v-on-click-outside.bubble="dropdownHandler"
    :class="{ 'pointer-events-auto translate-y-[0] opacity-100 z-30': isVisable }"
    class="absolute top-[54px] right-0 w-[230px] border-b border-l border-[var(--secondary-brand-color-1)] bg-white translate-y-[-100%] opacity-0 pointer-events-none ease-out duration-300 -z-10"
  >
    <ul class="w-full">
      <li>
        <div class="px-[24px] py-[8px]">會員中心</div>
      </li>
      <li class="border-t border-[var(--secondary-brand-color-1)]">
        <div class="px-[24px] py-[8px] text-red-800">登出</div>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped></style>
