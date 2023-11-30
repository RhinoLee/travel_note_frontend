import { vi, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from '@/views/entry/login/components/LoginForm.vue'

// 模擬外部依賴
vi.mock('@/stores/user/user')
vi.mock('@kyvg/vue3-notification')

describe('LoginComponent', () => {
  it('shows error message for invalid email input', async () => {
    const wrapper = mount(LoginForm)

    await wrapper.find('.email-field input[type="email"]').setValue('')
    await wrapper.find('button').trigger('click')

    const errorMessage = wrapper.find('.email-field .error-message').text()
    expect(errorMessage).toContain('帳號為必填項')
  })

  it('shows error message for invalid password input', async () => {
    const wrapper = mount(LoginForm)

    await wrapper.find('.password-field input[type="password"]').setValue('')
    await wrapper.find('button').trigger('click')

    const errorMessage = wrapper.find('.password-field .error-message').text()
    expect(errorMessage).toContain('密碼為必填項')
  })
})
