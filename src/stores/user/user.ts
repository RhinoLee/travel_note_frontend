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
          this.token = res.token
          localStore.setItem(LOGIN_TOKEN, res.token)

          dynamicAddRoutes()

          // go to home page
          router.push({ name: 'home' })
        }

        return res
      } catch (error) {
        console.log(error)
      }
    }
  }
})

export default useUserStore
