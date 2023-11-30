import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import FormModal from '@/components/common/formModal/FormModal.vue'
import { formFields } from '@/views/user/config/formFields'
import { userSchema } from '@/composables/validation/schema/userSchema'
import VueUploadComponent from 'vue-upload-component/src/FileUpload.vue'
import defaultImage from '@/assets/images/img_loginbg.webp'
import type { DirectiveBinding } from 'vue'

const mockDefaultImageDirective = {
  beforeMount(el: HTMLImageElement, binding: DirectiveBinding) {
    function onErrorHandler(event: Event) {
      const target = event.target as HTMLImageElement
      target.src = binding.value || defaultImage
      el.removeEventListener('error', onErrorHandler)
    }

    el.addEventListener('error', onErrorHandler)

    if (!el.src) {
      el.src = binding.value || defaultImage
    }
  }
}

config.global.components = {
  'file-upload': VueUploadComponent
}

config.global.directives = {
  'default-image': mockDefaultImageDirective
}

vi.mock('@/stores/global/global', () => {
  return {
    default: () => ({
      isLoading: true,
      isPageLoading: false
    })
  }
})

describe('FormModal', () => {
  it('renders form fields based on props', async () => {
    const wrapper = mount(FormModal, {
      props: {
        formFields,
        modalTitle: 'test modal title',
        schema: userSchema
      }
    })

    // 檢查是否依照 props formFields 中的每個配置渲染出對應 formItem
    for (const field of formFields) {
      expect(wrapper.find(`label[for="${field.prop}"]`).exists()).toBe(true)
    }
  })

  it('initializes form data based on formFields props', async () => {
    const wrapper = mount(FormModal, {
      props: {
        formFields,
        modalTitle: 'test modal title',
        schema: userSchema
      }
    })

    // 取得組件 instance
    const vm = wrapper.vm as any

    // 检查 formData 是否正確初始化
    for (const field of formFields) {
      const expectedValue = field.initValue ?? ''
      expect(vm.formData[field.prop]).toEqual(expectedValue)
    }
  })
})
