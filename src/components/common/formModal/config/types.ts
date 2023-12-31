import type { ObjectSchema } from 'yup'

export interface IFormField {
  prop: string
  title: string
  type: string
  placeholder: string
  initValue: any
  refFields: string[]
  yearsRange?: number[]
  minDate?: string
  maxDate?: string
  enableTimePicker?: boolean
}

export interface IModalProps {
  modalTitle: string
  formFields: IFormField[]
  schema: ObjectSchema<any>
}

export interface IFormModalData {
  [key: string]: any
}
