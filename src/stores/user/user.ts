import { defineStore } from 'pinia'
import { loginAPI } from '@/services/user'
import type { ILoginParams } from '@/services/user/type'
import { localStore } from '@/utils/webStorage'
import { LOGIN_TOKEN } from '@/common/constants'
import { dynamicAddRoutes } from '@/utils/dynamicAddRoutes'
import router from '@/router'

interface IUserState {
  name: string
  userInfo: any
  token: string
}

interface ILoginRes extends IUserState {
  success: boolean
  data: {
    token: string
  }
}

const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => ({
    name: '',
    userInfo: {},
    token: ''
  }),
  actions: {
    async loginAction(params: ILoginParams): Promise<ILoginRes | undefined> {
      try {
        const res: ILoginRes = await loginAPI(params)

        if (res.success) {
          this.token = res.data.token
          localStore.setItem(LOGIN_TOKEN, res.data.token)

          dynamicAddRoutes()

          // go to home page
          router.push({ name: 'home' })
        }

        return res
      } catch (error) {
        console.log(error)
      }
    },
    async loadWebStorageAction() {
      const token = localStore.getItem(LOGIN_TOKEN)
      if (token) {
        this.token = token
        dynamicAddRoutes()
      }
    }
  }
})

export default useUserStore
