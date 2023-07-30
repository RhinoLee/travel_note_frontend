import { defineStore } from 'pinia'

const useMapStore = defineStore({
  id: 'map',
  state: () => ({
    mapInstance: undefined
  })
})
