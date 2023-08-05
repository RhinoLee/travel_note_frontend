import type { ObjectSchema } from 'yup'

interface IFormField {
  prop: string
  title: string
  type: string
  placeholder: string
  initValue: any
}

export interface IModalProps {
  modalTitle: string
  modalBanner?: string
  formFields: IFormField[]
  schema: ObjectSchema<any>
}

export interface IFormModalData {
  [key: string]: any
}
