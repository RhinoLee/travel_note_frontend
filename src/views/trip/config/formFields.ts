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
      initValue: dayjs(start_date).toDate(),
      refFields: []
    },
    {
      prop: 'arrival_time',
      title: '開始時間',
      type: 'time',
      placeholder: '請選擇開始時間',
      initValue: {
        hours: 0,
        minutes: 0
      },
      refFields: ['leave_time']
    },
    {
      prop: 'leave_time',
      title: '結束時間',
      type: 'time',
      placeholder: '請選擇結束時間',
      initValue: {
        hours: 0,
        minutes: 0
      },
      refFields: ['arrival_time']
    }
  ]
}
