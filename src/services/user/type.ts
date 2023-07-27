export interface IRegisterParams {
  name: string
  email: string
  password: string
  provider: string
  providerId?: null | string
  [key: string]: any
}
