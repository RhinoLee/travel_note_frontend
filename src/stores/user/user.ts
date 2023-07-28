import { defineStore } from 'pinia'
import { loginAPI } from '@/services/user'
import type { ILoginParams } from '@/services/user/type'

interface IUserState {
  name: string
  userInfo: any
  token: string
}

const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => ({
    name: '',
    userInfo: {},
    token: ''
  }),
  actions: {
    async loginAction(params: ILoginParams) {
      const res = await loginAPI(params)
      return res
      console.log(res)
    }
  }
})

export default useUserStore
