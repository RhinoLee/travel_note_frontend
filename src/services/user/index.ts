import $axios from '@/services'

import type { IRegisterParams } from './type'

export const registerAPI = (data: IRegisterParams) => {
  return $axios.post({
    url: '/user',
    data: { ...data }
  })
}
