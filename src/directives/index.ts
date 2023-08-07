import { onBeforeUnmount } from 'vue'
import type { App, DirectiveBinding } from 'vue'
import defaultImage from '@/assets/images/img_loginbg.webp'

function registerGlobalDirective(app: App) {
  app.directive('defaultImage', {
    beforeMount(el: HTMLImageElement, binding: DirectiveBinding) {
      function onErrorHandler(event: Event) {
        const target = event.target as HTMLImageElement
        target.src = binding.value || defaultImage
        el.removeEventListener('error', onErrorHandler)
      }

      el.addEventListener('error', onErrorHandler)

      if (!el.src) {
        el.src = binding.value || defaultImage
      }
    }
  })
}

export default registerGlobalDirective
