import { defineStore } from 'pinia'

interface IGlobalState {
  isLoading: boolean
  isPageLoading: boolean
}

const useGlobalStore = defineStore({
  id: 'global',
  state: (): IGlobalState => ({
    isLoading: false,
    isPageLoading: false
  })
})

export default useGlobalStore
