import { defineStore } from 'pinia'
import {
  loginAPI,
  getGoogleLoginUrlAPI,
  googleLoginAPI,
  getUserInfoAPI,
  updateUserInfoAPI
} from '@/services/user'
import router from '@/router'
import { useStorage } from '@vueuse/core'
import type { ILoginParams, IUpdateUserParams } from '@/services/user/type'

interface IUserInfo {
  id: number | null
  name: string
  avatar: string | null
  email: string
}

interface IUserState {
  userInfo: any
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
    userInfo: useStorage('userInfo', { id: null, name: '', avatar: null, email: '' } as IUserInfo)
  }),
  actions: {
    storeUserDataToLocal(data: IUserInfo) {
      const { id, name, avatar, email } = data
      this.userInfo.id = id
      this.userInfo.name = name
      this.userInfo.avatar = avatar
      this.userInfo.email = email
    },
    async loginAction(params: ILoginParams): Promise<ILoginRes | undefined> {
      try {
        const res: ILoginRes = await loginAPI(params)

        if (res.success) {
          // this.setUserName(res.data.name)
          this.storeUserDataToLocal(res.data as IUserInfo)

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
        if (res.success) {
          this.storeUserDataToLocal(res.data as IUserInfo)
        }
        return res
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    async getUserInfoAction() {
      try {
        const result = await getUserInfoAPI()
        if (result.success) {
          this.userInfo = useStorage('userInfo', result.data)
        }
      } catch (err) {
        console.log('get user info action error: ', err)
      }
    },
    async updateUserInfoAction(data: IUpdateUserParams) {
      const formData = new FormData()

      Object.keys(data).forEach((key) => {
        if (key === 'name') {
          formData.append(key, data[key])
        } else if (key === 'avatar') {
          const avatarData = data[key] ?? null
          formData.append(key, avatarData as any)
        }
      })

      try {
        const result = await updateUserInfoAPI(formData)
        if (result.success) {
          const { avatar, name } = result.data
          this.userInfo.avatar = avatar
          this.userInfo.name = name
        }
        return result
      } catch (err) {
        console.log('update user info action error: ', err)
      }
    }
  }
})

export default useUserStore
