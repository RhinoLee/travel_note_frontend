import $axios from '@/services'
import type { IRegisterParams, ILoginParams, IUpdateUserParams } from './type'

export const registerAPI = (data: IRegisterParams) => {
  return $axios.post({
    url: '/user',
    data: { ...data }
  })
}

export const loginAPI = (data: ILoginParams) => {
  return $axios.post({
    url: '/user/login',
    data: { ...data }
  })
}

export const getGoogleLoginUrlAPI = () => {
  return $axios.get({
    url: '/user/google_login_url'
  })
}

export const googleLoginAPI = (data: { code: string }) => {
  return $axios.post({
    url: '/user/google_login',
    data
  })
}

export const getUserInfoAPI = () => {
  return $axios.get({
    url: '/user'
  })
}

export const updateUserInfoAPI = (data: FormData) => {
  return $axios.put({
    url: '/user',
    data
  })
}
