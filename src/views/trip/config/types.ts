import type { VueUploadItem } from 'vue-upload-component'

export interface IFormData {
  title: string
  start_date: string
  end_date: string
  tripImage: VueUploadItem[]
}
