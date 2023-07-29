import $axios from '@/services'
import { localStore } from '@/utils/webStorage'
import { LOGIN_TOKEN } from '@/common/constants'

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

// export const testApi = (data: any) => {
//   const token = localStore.getItem(LOGIN_TOKEN)
//   return $axios.post({
//     url: '/test',
//     data: { ...data },
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
// }
