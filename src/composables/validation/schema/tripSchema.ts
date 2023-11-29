import { object, string, date, mixed, ref } from 'yup'
import dayjs from 'dayjs'
import { formatDateToUTC } from '@/utils/formatDateTime'

export const tripSchema = object().shape({
  tripImage: mixed().notRequired(),
  title: string().required('旅程名稱為必填項'),
  start_date: date()
    .required('請選擇日期')
    .test('start_date', '開始時間需小於或等於結束時間', (value) => {
      const endDate: Date = this.resolve(ref('end_date'))
      return !value || !endDate || formatDateToUTC(value) <= formatDateToUTC(endDate)
    }),
  end_date: date()
    .required('請選擇日期')
    .test('end_date', '結束時間需大於或等於開始時間', (value) => {
      const startDate: Date = this.resolve(ref('start_date'))
      return !value || !startDate || formatDateToUTC(value) >= formatDateToUTC(startDate)
    })
})
