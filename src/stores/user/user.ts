import { defineStore } from 'pinia'
import { loginAPI, getGoogleLoginUrlAPI, googleLoginAPI } from '@/services/user'
import { getCookieValue } from '@/utils/getCookieValue'
import { dynamicAddRoutes } from '@/utils/dynamicAddRoutes'
import router from '@/router'
import type { ILoginParams } from '@/services/user/type'

interface IUserState {
  name: string
  userInfo: any
  csrfToken: string
}

interface ILoginRes extends IUserState {
  success: boolean
  data: {
    id: number
    name: string
  }
}

const useUserStore = defineStore({
  id: 'user',
  state: (): IUserState => ({
    name: '',
    userInfo: {},
    csrfToken: ''
  }),
  actions: {
    setCsrfToken(token: string) {
      this.csrfToken = token
    },
    async loginAction(params: ILoginParams): Promise<ILoginRes | undefined> {
      try {
        const res: ILoginRes = await loginAPI(params)

        if (res.success) {
          // this.token = res.data.token

          // 從 cookie 取得 csrf token
          const csrfToken = getCookieValue('csrf_token')

          if (!csrfToken) throw new Error('token required')
          this.setCsrfToken(csrfToken)

          // 登入成功動態加載路由
          dynamicAddRoutes()

          // go to home page
          router.push({ name: 'home' })
        }

        return res
      } catch (error) {
        console.log(error)
      }
    },
    async getGoogleLoginUrlAction() {
      try {
        const res = await getGoogleLoginUrlAPI()
        if (res.success) {
          location.href = res.data.login_url
        }
      } catch (err) {
        console.log(err)
      }
    },
    async googleLoginAction(data: string) {
      try {
        const res = await googleLoginAPI({ code: data })
        return res
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    async loadWebStorageAction() {
      const csrfToken = getCookieValue('csrf_token')
      if (csrfToken) {
        this.setCsrfToken(csrfToken)
        dynamicAddRoutes()
      }
    }
  }
})

export default useUserStore
