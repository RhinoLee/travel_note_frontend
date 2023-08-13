import type { VueUploadItem } from 'vue-upload-component'

export interface IFormData {
  title: string
  start_date: string
  end_date: string
  tripImage: VueUploadItem[]
}

interface IPosition {
  lat: number
  lng: number
}
export interface IMarkerParmas {
  place_id: string
  position: IPosition
}
