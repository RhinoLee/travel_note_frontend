import { reactive } from 'vue'
import { ObjectSchema, ValidationError } from 'yup'
import type { AnyObject } from 'yup'

interface IErrors {
  [propName: string]: string
}

/**
 * 使用 Yup schema 驗證表單資料。
 *
 * @param schema - 定義要驗證的欄位和規則的 Yup schema
 * @param data - 要驗證的表單資料
 * @returns {Object} 一個包含以下屬性的物件：
 *    errors - reactive 物件，用於儲存和追蹤驗證的錯誤訊息。
 *    validate - function，用於執行對整個表單的驗證。
 *    validateField - function，用於驗證特定的表單欄位。
 */
export function useFormValidation<T extends AnyObject>(schema: ObjectSchema<T>, data: T) {
  /**
    errors 是一個 reactive 物件，用於儲存並顯示每個輸入欄位的驗證錯誤訊息。
    例如：
    errors: {
      'field1': '錯誤訊息 1',
      'field2': '錯誤訊息 2',
      ...
    }
    此結構允許我們在每個輸入欄位下方動態顯示對應的錯誤訊息，讓使用者了解並修正錯誤。
  */

  const errors = reactive<IErrors>({})

  // 驗證 data 所有欄位
  async function validate() {
    try {
      await schema.validate(data, { abortEarly: false })
    } catch (err) {
      if (err instanceof ValidationError) {
        err.inner.forEach((errItem) => {
          if (errItem && errItem.path) {
            errors[errItem.path] = errItem.message
          }
        })
      } else {
        console.log(err)
      }
      throw err
    }
  }

  /**
   *  驗證指定單一欄位
   *  @field - 傳入要驗證的欄位的 prop
   *  @refFields - 傳入要連帶驗證的欄位
   */
  async function validateField(field: keyof T, refFields: Array<keyof T | null> = []) {
    console.log('validateField', refFields)

    try {
      // 檢查指定欄位
      await schema.validateAt(field as string, data)
      errors[field as string] = ''
      // 檢查指定欄位的 ref 欄位
      // for (let i = 0; i < refFields.length; i++) {
      //   await schema.validateAt(refFields[i] as string, data)
      //   errors[refFields[i] as string] = ''
      // }
      const validationPromises = refFields.map(async (refField) => {
        await schema.validateAt(refField as string, data)
        errors[refField as string] = ''
      })

      await Promise.all(validationPromises)
    } catch (err) {
      if (err instanceof ValidationError) {
        errors[err.path as string] = err.message
      } else {
        console.log(err)
      }
    }
  }

  // 清空 errors
  function clearErrors() {
    Object.keys(errors).forEach((key) => {
      errors[key] = ''
    })
  }

  return { errors, validate, validateField, clearErrors }
}
