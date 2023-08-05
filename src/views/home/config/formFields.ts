import { object, string, ref, date } from 'yup'
import dayjs from 'dayjs'

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
    prop: 'startDate',
    title: '開始日期',
    type: 'date',
    placeholder: '請選擇開始日期',
    initValue: dayjs(),
    refFields: ['endDate']
  },
  {
    prop: 'endDate',
    title: '結束日期',
    type: 'date',
    placeholder: '請選擇結束日期',
    initValue: dayjs(),
    refFields: ['startDate']
  }
]

export const schema = object().shape({
  title: string().required('請輸入名稱'),
  startDate: date().required('請選擇日期').max(ref('endDate'), '開始時間需小於結束時間'),
  endDate: date().required('請選擇日期').min(ref('startDate'), '結束時間需大於開始時間')
})
