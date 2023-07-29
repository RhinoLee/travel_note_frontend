enum StorageType {
  LocalStorage,
  SessionStorage
}

class WebStorage {
  storage: Storage

  constructor(type: StorageType) {
    this.storage = type === StorageType.LocalStorage ? localStorage : sessionStorage
  }

  setItem(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value ?? ''))
  }

  getItem(key: string) {
    const value = this.storage.getItem(key)
    return value ? JSON.parse(value) : ''
  }

  deleteItem(key: string) {
    this.storage.removeItem(key)
  }

  clearItme() {
    this.storage.clear()
  }
}

const localStore = new WebStorage(StorageType.LocalStorage)
const sessionStore = new WebStorage(StorageType.SessionStorage)

export { localStore, sessionStore }
