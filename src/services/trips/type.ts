import type { VueUploadItem } from 'vue-upload-component'
import type { TimeStringFormat } from '@/utils/formatDateTime'
export interface ITripParams {
  title: string
  start_date: string
  end_date: string
  tripImage?: VueUploadItem | null
}

export interface IListParams {
  limit: number
  page: number
}

export interface IListItem {
  id: number
  name: string
  imageUrl?: string
  start_date: string
  end_date: string
}

export interface IListResItem {
  id: number
  name: string
  image_url: string
  start_date: string
  end_date: string
}

export interface IListResPage {
  limit: number
  offset: number
  totalSize: number
  totalPages: number
  page: number
}

export interface IListRes {
  data: IListResItem[]
  success: boolean
  pagination: IListResPage
}

export interface IDayTripParams {
  trip_id: number
  trip_date: string
  name: string
  address: string
  place_id: string
  lat: number
  lng: number
  arrival_time: TimeStringFormat
  leave_time: TimeStringFormat
  visit_order: number
}

export type IDayDestinationParmas = Pick<IDayTripParams, 'trip_id' | 'trip_date'>

/**
 * 更新 tabel 資料的 id params
 * @id - tripdays_destinations table id
 * @trip_id - trips table id
 */

export interface IDayDestinationRes {
  id: number
  arrival_time: string
  leave_time: string
  visit_order: number
  name: string
  place_id: string
  trip_date: string
  trip_id: number
  lat: number
  lng: number
}

export type IEditDayDestination = Pick<
  IDayDestinationRes,
  'name' | 'trip_date' | 'arrival_time' | 'leave_time'
>

export type IUpdateDayDestinationParams = Pick<
  IDayDestinationRes,
  'id' | 'arrival_time' | 'leave_time' | 'name' | 'trip_date' | 'trip_id'
>

export type IUpdateDayDestinationId = Pick<IDayDestinationRes, 'trip_id' | 'id'>

export interface IDestinationWithDistanceInfo extends IDayDestinationRes {
  leg?: google.maps.DirectionsLeg
}
