import type { VueUploadItem } from 'vue-upload-component'

export interface ITripParams {
  title: string
  startDate: string
  endDate: string
  tripImage?: VueUploadItem | null
}
