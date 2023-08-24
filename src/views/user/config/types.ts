import type { VueUploadItem } from 'vue-upload-component'

export interface IFormData {
  avatar: VueUploadItem[] | string
  name: string
}
