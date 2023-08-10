import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import weekday from 'dayjs/plugin/weekday'
import 'dayjs/locale/zh-tw'

dayjs.locale('zh-tw')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)
dayjs.extend(weekday)

export interface ITimeObj {
  hours: number | string
  minutes: number | string
  seconds?: number | string
}

export type TimeStringFormat = `${string}:${string}:${string}`

export function formatTime(obj: ITimeObj, inputDate: Date | string): TimeStringFormat {
  const { hours, minutes } = obj
  let hoursStr = ''
  let minutesStr = ''

  if (Number(hours) < 10) hoursStr = '0' + hours
  else hoursStr = String(hours)

  if (Number(minutes) < 10) minutesStr = '0' + minutes
  else minutesStr = String(minutes)

  // to utc timezone
  const timeString = `${hoursStr}:${minutesStr}:00`
  const dateString = dayjs(inputDate).format('YYYY-MM-DD')
  const completeDateTime = dateString + ' ' + timeString

  const utcTime = dayjs(completeDateTime).utc().format('HH:mm:ss')

  return utcTime as TimeStringFormat
}

export function formatDateToUTC(inputDate: Date | string) {
  return dayjs(inputDate).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss')
}

export function dateToLocalDate(inputDate: Date | string) {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return dayjs(inputDate).tz(localTimezone).format('YYYY-MM-DD')
}

export function timeToLocalTime(inputDate: Date | string, inputTime: string) {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const dateString = dayjs(inputDate).format('YYYY-MM-DD')
  const completeDateTime = dateString + ' ' + inputTime
  const utcDateTime = dayjs.utc(completeDateTime)

  return dayjs(utcDateTime).tz(localTimezone).format('HH:mm')
}

export function generateDateRange(
  startDate: string,
  endDate: string
): { date: string; weekday: string }[] {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const dateArray: { date: string; weekday: string }[] = []

  let currentDate = start

  while (currentDate.isSameOrBefore(end)) {
    dateArray.push({
      date: currentDate.format('YYYY-MM-DD'),
      weekday: currentDate.format('dddd')
    })
    currentDate = currentDate.add(1, 'day')
  }

  return dateArray
}
