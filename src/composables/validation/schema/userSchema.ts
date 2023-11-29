import { object, string, date, mixed, ref } from 'yup'
import dayjs from 'dayjs'
import { formatDateToUTC } from '@/utils/formatDateTime'

export const userSchema = object().shape({
  avatar: mixed().notRequired(),
  name: string().required('使用者名稱為必填項')
})
