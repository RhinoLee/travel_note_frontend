import type { VueUploadItem } from 'vue-upload-component'

export interface IFormData {
  title: string
  startDate: string
  endDate: string
  tripImage: VueUploadItem[]
}
