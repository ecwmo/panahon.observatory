import { z } from 'zod'

export const ReportImages = z.object({
  files: z.string().array(),
  staticFiles: z.string().array(),
})
