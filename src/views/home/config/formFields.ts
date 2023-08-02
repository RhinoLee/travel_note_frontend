export const formFields = [
  {
    prop: 'title',
    title: '旅程名稱',
    type: 'text',
    placeholder: '請輸入旅程名稱',
    rules: [{ required: true, message: '請輸入旅程名稱', trigger: 'blur' }],
    initValue: ''
  },
  {
    prop: 'startDate',
    title: '開始日期',
    type: 'date',
    placeholder: '請選擇開始日期',
    rules: [{ required: true, message: '請選擇開始日期', trigger: 'blur' }],
    initValue: ''
  },
  {
    prop: 'endDate',
    title: '結束日期',
    type: 'date',
    placeholder: '請選擇結束日期',
    rules: [{ required: true, message: '請選擇結束日期', trigger: 'blur' }],
    initValue: ''
  },
  {
    prop: 'pic',
    title: '旅程圖片',
    type: 'file',
    placeholder: '請輸入旅程圖片',
    rules: [{ required: true, message: '請輸入旅程圖片', trigger: 'blur' }],
    initValue: ''
  }
]
