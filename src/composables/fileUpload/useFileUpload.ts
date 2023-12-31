import { ref } from 'vue'
import type { Ref } from 'vue'
import type VueUploadComponent from 'vue-upload-component/src/FileUpload.vue'
import type { VueUploadItem } from 'vue-upload-component'

interface IFileUpload {
  previewFile: VueUploadItem | null
  inputFile: (newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined) => void
  inputFilter: (
    newFile: VueUploadItem | undefined,
    oldFile: VueUploadItem | undefined,
    prevent: (prevent?: boolean) => boolean
  ) => void
  clearPreviewFile: () => void
  upload: Ref<InstanceType<typeof VueUploadComponent> | null>
}

export function useFileUpload(): IFileUpload {
  const upload = ref<InstanceType<typeof VueUploadComponent> | null>(null)
  const previewFile = ref<any>(null)

  function inputFile(newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined) {
    previewFile.value = newFile
  }

  function inputFilter(
    newFile: VueUploadItem | undefined,
    oldFile: VueUploadItem | undefined,
    prevent: (prevent?: boolean) => boolean
  ) {
    if (newFile && newFile.name && !oldFile) {
      // Filter non-image file
      if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
        console.log('File not supported')
        return prevent()
      }
    }
    // 預覽檔案
    if (newFile && newFile.file) {
      // Create a blob field
      newFile.blob = ''
      const URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file)
      }
    }
  }

  function clearPreviewFile() {
    previewFile.value = null
  }

  return { previewFile, inputFile, inputFilter, clearPreviewFile, upload }
}
