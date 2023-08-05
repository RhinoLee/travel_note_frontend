import { object, string } from 'yup'

export const formFields = [
  {
    prop: 'tripImage',
    title: '封面圖片',
    type: 'singleFile',
    placeholder: '請輸入旅程圖片',
    initValue: []
  },
  {
    prop: 'title',
    title: '旅程名稱',
    type: 'text',
    placeholder: '請輸入旅程名稱',
    initValue: ''
  },
  {
    prop: 'startDate',
    title: '開始日期',
    type: 'date',
    placeholder: '請選擇開始日期',
    initValue: ''
  },
  {
    prop: 'endDate',
    title: '結束日期',
    type: 'date',
    placeholder: '請選擇結束日期',
    initValue: ''
  }
]

export const schema = object().shape({
  title: string().required('請輸入名稱'),
  startDate: string().required('請選擇日期'),
  endDate: string().required('請選擇日期')
})
