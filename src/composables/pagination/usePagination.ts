import { ref } from 'vue'
import type { Ref } from 'vue'
import type { IListParams, IListResPage } from '@/services/trips/type'

/**
 *
 * @param fetchDataFn - 頁數變動的時候要 call 的 function
 */
export function usePagination(fetchDataFn: ({ page, limit }: IListParams) => Promise<any>) {
  const currentPage: Ref<number> = ref(1)
  const totalSize: Ref<number> = ref(0)
  const totalPages: Ref<number> = ref(0)
  const limit: Ref<number> = ref(3)

  async function fetchPage(page: number) {
    const data = await fetchDataFn({ page, limit: limit.value })
    setPageParams(data.pagination)
  }

  function setPageParams(pagination: IListResPage) {
    totalSize.value = pagination.totalSize
    totalPages.value = pagination.totalPages
    currentPage.value = pagination.page
    limit.value = pagination.limit
  }

  function goToPage(page: number) {
    if (page > 0 && page <= totalPages.value) {
      fetchPage(page)
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      goToPage(currentPage.value + 1)
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      goToPage(currentPage.value - 1)
    }
  }

  return {
    currentPage,
    totalSize,
    totalPages,
    limit,
    setPageParams,
    goToPage,
    nextPage,
    prevPage
  }
}
