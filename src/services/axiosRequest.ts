import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import useUserStore from '@/stores/user/user'
import useGlobalStore from '@/stores/global/global'
import router from '@/router/'
import { BASE_URL } from './config'
import { getCookieValue } from '@/utils/getCookieValue'

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

  async request(config: AxiosRequestConfig) {
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
    }
  }

  get(config: AxiosRequestConfig) {
    return this.request({ ...config, method: 'get' })
  }

  post(config: AxiosRequestConfig) {
    return this.request({ ...config, method: 'post' })
  }

  delete(config: AxiosRequestConfig) {
    return this.request({ ...config, method: 'delete' })
  }

  patch(config: AxiosRequestConfig) {
    return this.request({ ...config, method: 'patch' })
  }

  put(config: AxiosRequestConfig) {
    return this.request({ ...config, method: 'put' })
  }
}

export default AxiosRequest
