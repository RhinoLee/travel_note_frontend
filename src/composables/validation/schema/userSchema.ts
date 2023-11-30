import { object, string, date, mixed, ref } from 'yup'

export const userSchema = object().shape({
  avatar: mixed().notRequired(),
  name: string().required('使用者名稱為必填項')
})
