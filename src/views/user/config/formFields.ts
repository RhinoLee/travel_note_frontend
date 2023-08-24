import { object, string } from 'yup'

export const formFields = [
  {
    prop: 'avatar',
    title: '大頭貼',
    type: 'avatar',
    placeholder: '請選擇大頭貼',
    initValue: [],
    refFields: []
  },
  {
    prop: 'name',
    title: '使用者名稱',
    type: 'text',
    placeholder: '請輸入使用者名稱',
    initValue: '',
    refFields: []
  }
]

export const schema = object().shape({
  name: string().required('請輸入名稱')
})
