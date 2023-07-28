import $axios from '@/services'

import type { IRegisterParams, ILoginParams } from './type'

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
