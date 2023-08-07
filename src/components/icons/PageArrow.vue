<script setup lang="ts">
import { ref, computed } from 'vue'
import { MAIN_BRAND_COLOR_1 } from '@/common/constants'

interface IProps {
  color?: string
  angle?: number
}

const props = withDefaults(defineProps<IProps>(), {
  color: MAIN_BRAND_COLOR_1,
  angle: 0
})

const svgStyle = computed(() => ({
  transform: `rotate(${props.angle}deg)`
}))
</script>

<template>
  <svg
    :style="svgStyle"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16 4L8 12L16 20" :stroke="color" stroke-width="1.5" stroke-linecap="round" />
  </svg>
</template>
