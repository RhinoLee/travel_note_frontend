import { describe, it, expect, vi } from 'vitest'
import { object, string } from 'yup'
import { useValidation } from '@/composables/validation/useValidation'

const testSchema = object().shape({
  name: string().required('name 為必填項')
})

describe('useValidation', () => {
  it('check valid input', async () => {
    const { validate, state } = useValidation(testSchema)
    const isValid = await validate({ name: 'test input' })
    expect(isValid).toBe(true)
    expect(state.isValid).toBe(true)
    expect(state.errors).toEqual({})
  })

  it('check invalid input', async () => {
    const { validate, state } = useValidation(testSchema)
    const isValid = await validate({ name: '' })
    expect(isValid).toBe(false)
    expect(state.isValid).toBe(false)
    expect(state.errors).toEqual({ name: 'name 為必填項' })
  })

  it('should throw an error when a non-ValidationError occurs', async () => {
    const testSchema = object({
      name: string().test('Test non-ValidationError', 'test error', () => {
        throw new Error('Unexpected Error')
      })
    })

    const { validate, state } = useValidation(testSchema)

    // 檢查 state.errors 和 state.isValid 的狀態，確保它們沒有被更新
    expect(state.errors).toEqual({})
    expect(state.isValid).toBe(true)
  })
})
