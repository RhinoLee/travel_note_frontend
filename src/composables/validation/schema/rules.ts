import { object, string } from 'yup'

export const loginSchema = object().shape({
  email: string().required('帳號為必填項'),
  password: string().required('密碼為必填項')
})
