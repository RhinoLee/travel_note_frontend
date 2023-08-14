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

/**
 * @place_id - google map api place_id
 * @position - 包含經緯度的物件
 * @isDestination - 是否為目的地
 * @id - 當下目的地行程的 id
 */
export interface IMarkerParmas {
  place_id: string
  position: IPosition
  isDestination: boolean
  id: number
}
