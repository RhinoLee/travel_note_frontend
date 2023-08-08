import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export interface ITimeObj {
  hours: number
  minutes: number
}

export type TimeStringFormat = `${string}:${string}:${string}`

export function formatTime(obj: ITimeObj): TimeStringFormat {
  const { hours, minutes } = obj
  let hoursStr = ''
  let minutesStr = ''

  if (hours < 10) hoursStr = '0' + hours
  else hoursStr = String(hours)

  if (minutes < 10) minutesStr = '0' + minutes
  else minutesStr = String(minutes)

  return `${hoursStr}:${minutesStr}:00`
}

export function formatDate(inputDate: string) {
  // 轉換為UTC並設置時間為整點
  const utcMidnight = dayjs(inputDate).utc().startOf('day').format()

  return dayjs(utcMidnight).format('YYYY-MM-DD HH:mm:ss')
}
