<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '@/components/Header/SearchBar.vue'
import { vOnClickOutside } from '@vueuse/components'

import type { OnClickOutsideHandler } from '@vueuse/core'

const isVisable = ref(false)

const dropdownHandler: OnClickOutsideHandler = (event) => {
  isVisable.value = false
}

function setDropdownVisable() {
  isVisable.value = !isVisable.value
}

defineExpose({
  setDropdownVisable
})
</script>

<template>
  <div
    v-on-click-outside.bubble="dropdownHandler"
    :class="{ 'pointer-events-auto translate-y-[0] opacity-100 z-30': isVisable }"
    class="absolute top-[54px] left-0 w-full border-b border-[var(--secondary-brand-color-1)] px-[24px] py-[8px] bg-white translate-y-[-100%] opacity-0 pointer-events-none ease-out duration-300 -z-10"
  >
    <ul>
      <li>
        <SearchBar></SearchBar>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped></style>
