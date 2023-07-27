import AxiosRequest from './axiosRequest'
import { BASE_URL } from './config'

const $axios = new AxiosRequest({
  baseURL: BASE_URL
})

export default $axios
