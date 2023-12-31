import type { VueUploadItem } from 'vue-upload-component'

export interface IRegisterParams {
  name: string
  email: string
  password: string
  provider: string
  providerId?: null | string
  [key: string]: any
}

export interface ILoginParams {
  email: string
  password: string
  [key: string]: string
}

export interface IUpdateUserParams {
  name: string
  avatar: string | null | VueUploadItem
}
