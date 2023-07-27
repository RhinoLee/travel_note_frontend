import { defineStore } from 'pinia'

const useErrorMessageStore = defineStore({
  id: 'error-message',
  state: () => ({
    message: ''
  }),
  actions: {
    setMessage(message: string) {
      this.message = message
    },
    clearMessage() {
      this.message = ''
    }
  }
})

export default useErrorMessageStore
