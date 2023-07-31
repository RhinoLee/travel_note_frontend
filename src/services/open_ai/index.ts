import $axios from '@/services'

export const completionAPI = (data: string) => {
  return $axios.post({
    url: '/openAI/completion',
    data: { query: data }
  })
}
