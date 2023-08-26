import { defineStore } from 'pinia'

interface IGlobalState {
  isLoading: boolean
}

const useGlobalStore = defineStore({
  id: 'global',
  state: (): IGlobalState => ({
    isLoading: false
  })
})

export default useGlobalStore
