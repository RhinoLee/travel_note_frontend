import axios from 'axios'
import useUserStore from '@/stores/user/user'
import useGlobalStore from '@/stores/global/global'
import router from '@/router/'
import { BASE_URL } from './config'
import { getCookieValue } from '@/utils/getCookieValue'

import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import type { ICustomConfig } from './config/types'

class AxiosRequest {
  instance: AxiosInstance
  interceptors?: any

  constructor(config: any) {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 20000
    })
    // 可傳入 interceptors
    this.interceptors = config.interceptors

    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorError
    )

    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorError
    )

    // 共用 interceptors
    this.instance.interceptors.request.use(
      (config: any) => {
        const csrfToken = getCookieValue('csrf_token') || ''
        config.headers = {
          ...config.headers,
          'X-CSRF-Token': csrfToken
        }
        useGlobalStore().isLoading = true
        console.log('axios interceptors config', config)

        return config
      },
      (error: any) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (res: any) => {
        useGlobalStore().isLoading = false
        return res
      },
      (error: any) => {
        useGlobalStore().isLoading = false
        // 401 直接登出
        if (error.response.status === 401) {
          useUserStore().storeUserDataToLocal(null)
          router.push({ name: 'login' })
        }
        return Promise.reject(error)
      }
    )
  }

  async request(config: AxiosRequestConfig, customConfig?: ICustomConfig) {
    useGlobalStore().isPageLoading = customConfig?.requireLoadingPage || false

    try {
      const res = await this.instance.request(config)

      return { success: res.data.success, ...res.data }
    } catch (error: any) {
      if (error instanceof Error) {
        // This is a general Error
        throw error
      } else if (error && error.isAxiosError) {
        // This is an AxiosError
        const axiosError = error as AxiosError
        throw new Error(axiosError.message)
      }
    } finally {
      useGlobalStore().isPageLoading = false
    }
  }

  get(config: AxiosRequestConfig, customConfig?: ICustomConfig) {
    return this.request({ ...config, method: 'get' }, customConfig)
  }

  post(config: AxiosRequestConfig, customConfig?: ICustomConfig) {
    return this.request({ ...config, method: 'post' }, customConfig)
  }

  delete(config: AxiosRequestConfig, customConfig?: ICustomConfig) {
    return this.request({ ...config, method: 'delete' }, customConfig)
  }

  patch(config: AxiosRequestConfig, customConfig?: ICustomConfig) {
    return this.request({ ...config, method: 'patch' }, customConfig)
  }

  put(config: AxiosRequestConfig, customConfig?: ICustomConfig) {
    return this.request({ ...config, method: 'put' }, customConfig)
  }
}

export default AxiosRequest
