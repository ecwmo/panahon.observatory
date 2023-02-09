import { defineStore } from 'pinia'

import { ReportImages } from '@/schemas/report'

export const useReportStore = defineStore('report', () => {
  const route = useRoute()

  return {
    ...useQuery(
      ['reports', route.query.view],
      async () =>
        await axios.get(`/api/report.php?view=${route.query.view}`).then(({ data }) => ReportImages.parse(data))
    ),
  }
})
