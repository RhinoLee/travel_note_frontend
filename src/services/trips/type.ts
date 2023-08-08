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
  data: Array<IListResItem>
  success: boolean
  pagination: IListResPage
}

export interface IDayTripParams {
  tripId: number
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
