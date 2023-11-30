import { object, string, date, mixed, number } from 'yup'

const timeIsAfter = (arrival_time: any, leave_time: any) => {
  if (arrival_time.hours < leave_time.hours) return true
  if (arrival_time.hours === leave_time.hours && arrival_time.minutes < leave_time.minutes)
    return true
  return false
}

export const tripDaySchema = object().shape({
  name: string().required('目的地名稱為必填項'),
  arrival_time: object()
    .shape({
      hours: number().min(0).max(23).nullable(),
      minutes: number().min(0).max(59).nullable()
    })
    .nullable()
    .required('請選擇時間')
    .test('is-after-arrival', '到達時間需要比離開時間小', function (value) {
      const { leave_time } = this.parent
      if (!leave_time) return true
      return timeIsAfter(value, leave_time)
    }),
  leave_time: object({
    hours: number().min(0).max(23).nullable(),
    minutes: number().min(0).max(59).nullable()
  })
    .nullable()
    .required('請選擇時間')
    .test('is-after-arrival', '離開時間需要比到達時間大', function (value) {
      const { arrival_time } = this.parent
      if (!arrival_time) return true
      return timeIsAfter(arrival_time, value)
    }),
  trip_date: date().required('請選擇日期')
})
