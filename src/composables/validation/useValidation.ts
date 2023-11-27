import { reactive } from 'vue'
import { ValidationError, type ObjectSchema } from 'yup'

interface ValidationState {
  errors: Record<string, string>
  isValid: boolean
}

export function useValidation<T extends Record<string, any>>(schema: ObjectSchema<T>) {
  const state = reactive<ValidationState>({
    errors: {},
    isValid: true
  })

  const validate = async (values: T) => {
    try {
      await schema.validate(values, { abortEarly: false })
      state.errors = {}
      state.isValid = true

      return true
    } catch (err) {
      if (err instanceof ValidationError) {
        const errors = err.inner.reduce((acc, error) => {
          if (error.path) {
            acc[error.path] = error.message
          }
          return acc
        }, {} as Record<string, string>)
        state.errors = errors
        state.isValid = false
      } else {
        state.errors = {}
        state.isValid = true
        throw err
      }

      return false
    }
  }

  return { validate, state }
}
