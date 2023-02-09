import { z } from 'zod'

export const ReportImages = z.object({
  reportImgs: z.string().array(),
  staticImgs: z.string().array(),
})
