import { object, string, ref, date } from 'yup'
import dayjs from 'dayjs'
import { formatDateToUTC } from '@/utils/formatDateTime'

export const formFields = [
  {
    prop: 'tripImage',
    title: '封面圖片',
    type: 'singleFile',
    placeholder: '請輸入旅程圖片',
    initValue: [],
    refFields: []
  },
  {
    prop: 'title',
    title: '旅程名稱',
    type: 'text',
    placeholder: '請輸入旅程名稱',
    initValue: '',
    refFields: []
  },
  {
    prop: 'start_date',
    title: '開始日期',
    type: 'date',
    placeholder: '請選擇開始日期',
    enableTimePicker: false,
    initValue: dayjs().toDate(),
    refFields: ['end_date']
  },
  {
    prop: 'end_date',
    title: '結束日期',
    type: 'date',
    placeholder: '請選擇結束日期',
    enableTimePicker: false,
    initValue: dayjs().toDate(),
    refFields: ['start_date']
  }
]

export const schema = object().shape({
  title: string().required('請輸入名稱'),
  start_date: date()
    .required('請選擇日期')
    .test('start_date', '開始時間需小於或等於結束時間', function (value) {
      const endDate: Date = this.resolve(ref('end_date'))
      return !value || !endDate || formatDateToUTC(value) <= formatDateToUTC(endDate)
    }),
  end_date: date()
    .required('請選擇日期')
    .test('end_date', '結束時間需大於或等於開始時間', function (value) {
      const startDate: Date = this.resolve(ref('start_date'))
      return !value || !startDate || formatDateToUTC(value) >= formatDateToUTC(startDate)
    })
})
