import dayjs from 'dayjs'

export const formFields = [
  {
    prop: 'tripImage',
    title: '封面圖片',
    type: 'singleFile',
    placeholder: '請輸入旅程圖片',
    initValue: null,
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
