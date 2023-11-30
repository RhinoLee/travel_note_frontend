import type { IErrors } from '@/composables/validation/useFormValidation'

export function resolveProps(formField: any, errors: IErrors): any {
  const commonProps = {
    label: formField.title,
    fieldId: formField.prop
  }

  switch (formField.type) {
    case 'text':
      return {
        ...commonProps,
        error: errors[formField.prop]
      }
    case 'pureText':
      return {
        ...commonProps
      }
    case 'date':
      return {
        ...commonProps,
        yearsRange: formField.yearsRange,
        minDate: formField.minDate,
        maxDate: formField.maxDate,
        enableTimePicker: formField.enableTimePicker,
        error: errors[formField.prop]
      }
    case 'time':
      return {
        ...commonProps,
        error: errors[formField.prop]
      }
    case 'avatar':
    case 'singleFile':
      return {
        ...commonProps
      }
    default:
      return commonProps
  }
}
