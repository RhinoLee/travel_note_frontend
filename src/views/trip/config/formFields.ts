import { object, string, date, number } from 'yup'
import dayjs from 'dayjs'
import type { IFormField } from '@/components/common/formModal/config/types'

export function formFieldsHandler({ start_date, end_date }: any): IFormField[] {
  return [
    {
      prop: 'name',
      title: '目的地名稱',
      type: 'pureText',
      placeholder: '',
      initValue: '',
      refFields: []
    },
    {
      prop: 'trip_date',
      title: '日期',
      type: 'date',
      placeholder: '請選擇日期',
      yearsRange: [dayjs(start_date).get('year'), dayjs(end_date).get('year')],
      minDate: dayjs(start_date).format(),
      maxDate: dayjs(end_date).format(),
      enableTimePicker: false,
      initValue: dayjs(start_date),
      refFields: []
    },
    {
      prop: 'arrival_time',
      title: '開始時間',
      type: 'time',
      placeholder: '請選擇開始時間',
      initValue: {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes()
      },
      refFields: ['leave_time']
    },
    {
      prop: 'leave_time',
      title: '結束時間',
      type: 'time',
      placeholder: '請選擇結束時間',
      initValue: {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes()
      },
      refFields: ['arrival_time']
    }
  ]
}

const timeIsAfter = (arrival_time: any, leave_time: any) => {
  if (arrival_time.hours < leave_time.hours) return true
  if (arrival_time.hours === leave_time.hours && arrival_time.minutes < leave_time.minutes)
    return true
  return false
}

export const schema = object().shape({
  name: string().required('請輸入名稱'),
  arrival_time: object()
    .shape({
      hours: number().min(0).max(23),
      minutes: number().min(0).max(59)
    })
    .test('is-after-arrival', '到達時間需要比離開時間小', function (value) {
      const { leave_time } = this.parent
      return timeIsAfter(value, leave_time)
    })
    .required('請選擇時間'),
  leave_time: object({
    hours: number().min(0).max(23),
    minutes: number().min(0).max(59)
  })
    .test('is-after-arrival', '離開時間需要比到達時間大', function (value) {
      const { arrival_time } = this.parent
      return timeIsAfter(arrival_time, value)
    })
    .required('請選擇時間'),
  trip_date: date().required('請選擇日期')
})
