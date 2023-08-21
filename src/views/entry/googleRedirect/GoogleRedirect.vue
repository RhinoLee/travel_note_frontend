<script setup lang="ts">
import { onMounted } from 'vue'
import useUserStore from '@/stores/user/user'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  // 如果有成功拿到 code，代表通過 google 登入驗證，把 code 傳給後端
  if (route.query.code) {
    // call api
    try {
      const res = await userStore.googleLoginAction(route.query.code as string)
      if (res.success) {
        router.push({ name: 'home' })
      } else {
        console.log('login failed 1')
        router.push({ name: 'login' })
      }
    } catch (err) {
      console.log('login failed 2')

      router.push({ name: 'login' })
    }
  } else {
    console.log('login failed 3')
    router.push({ name: 'login' })
  }
})
</script>

<template>
  <div>
    <h2 class="text-center">身份驗證中，請稍候...</h2>
  </div>
</template>

<style lang="less" scoped></style>
