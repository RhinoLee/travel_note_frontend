import type { VueUploadItem } from 'vue-upload-component'

export interface ITripParams {
  title: string
  startDate: string
  endDate: string
  tripImage?: VueUploadItem | null
}

export interface IListParams {
  limit: number
  page: number
}

export interface IListItem {
  id: number
  name: string
  imageUrl: string
  startDate: string
  endDate: string
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
